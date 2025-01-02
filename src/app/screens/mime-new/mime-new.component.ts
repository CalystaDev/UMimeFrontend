import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Host } from '../../../services/hosts.model';
import { FeedbackService } from '../../../services/feedback.model';
import { FormsModule } from '@angular/forms';
import { PastMimesService } from '../../../services/past-mimes.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Video } from '../../../services/video.model';
import { Mime } from '../../../services/mimes.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MimeCreationService } from '../../../services/mime-creation.service';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './mime-new.component.html',
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent implements OnInit, OnDestroy {
  username: string = '';
  userId: string = '';
  userEmail: string = '';
  selectedVideo: Video | null = null;

  sub = null;

  liked = false;
  disliked = false;

  feedbackText: string = ''; // Bind this to the input field

  error: string | null = null;
  mimeId: string | null = null;

  mime: Mime | null = null;

  private subscriptions: Subscription | null = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pastMimesService: PastMimesService,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private mimeCreationService: MimeCreationService,
    private firestore: Firestore

  ) { }

  async ngOnInit() {

    const mimeState = this.mimeCreationService.getMimeState();
    console.log('Mime state:', mimeState);

    if (mimeState && mimeState.mime) {
      this.mime = mimeState.mime;
      this.selectedVideo = mimeState.backgroundVideo as Video;
      this.username = mimeState.user?.displayName || '';
      this.userId = mimeState.user?.uid || '';
      this.userEmail = mimeState.user?.email || '';

      this.createMime();
    } else {
      this.subscriptions = this.activatedRoute.params.subscribe(params => {
        const mid = params['mid'];
        if (mid) {
          console.log('Loading existing mime:', mid);
          this.loadExistingMime(mid);
        }
      });
    }

  }


  async createMime() {
    try {
      // Step 1: Create the mime and store in Firestore
      const mimeId = await this.pastMimesService.addMimeToFirestore(this.mime!);

      this.mime!.mid = mimeId;
      this.updateMimeStatus('Creating Mime');
      this.startMimeGeneration();
    } catch (error) {
      console.error('Error creating mime:', error);
      this.updateMimeStatus('Failed to create mime');
    }
  }

  async startMimeGeneration() {
    const hostId = this.mime!.hosts[0].hid;
    console.log("\n\n\nSTARTED MIME GEN\n\n\n")
    try {
      // Increment host uses
      const hostRef = doc(this.firestore, `hosts/${hostId}`);
      const videoDocId = this.selectedVideo!.vid;  // Using vid which contains the Firestore doc ID

      await updateDoc(hostRef, {
        uses: increment(1),
      });
      console.log("Hosts incremented!");
      const videoRef = doc(this.firestore, `background_vids/${videoDocId}`);
      await updateDoc(videoRef, {
        uses: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing host uses:', error);
    }
    this.pastMimesService.generateScript(this.mime!.prompt, this.mime!.hosts[0].apiMappedID).subscribe({
      next: async (generatedData) => {

        this.mime!.title = generatedData.title;
        this.mime!.script = generatedData.script;
        this.updateMimeStatus('Generated Script');

        this.pastMimesService.generateImages(generatedData.video_id).subscribe({
          next: () => {
            this.updateMimeStatus('Generated Images');

            this.pastMimesService.generateAudio(generatedData.video_id).subscribe({
              next: () => {
                this.updateMimeStatus('Generated Audio');

                this.pastMimesService.generateVideo(generatedData.video_id).subscribe({
                  next: (videoData) => {
                    this.mime!.status = 'Generated Video';
                    this.mime!.videoUrl = videoData.videoPath;
                  },
                  error: (err) => this.handleError(err, 'Error generating video')
                });
              },
              error: (err) => this.handleError(err, 'Error generating audio')
            });
          },
          error: (err) => this.handleError(err, 'Error generating images')
        });
      },
      error: (err) => this.handleError(err, 'Error generating script')
    });
  }

  handleError(error: any, message: string) {
    console.error(message, error);
    this.mime!.status = 'Error';
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  updateMimeStatus(status: string) {
    this.mime!.status = status;
  }

  loadExistingMime(mid: string) {
    // Load existing mime
    this.subscriptions?.add(this.pastMimesService.getMimeById(mid).subscribe({
      next: (mime) => {
        this.mime = mime;
      },
      error: (error) => {
        console.error('Error loading mime:', error);
        this.error = 'Failed to load mime';
        this.router.navigate(['/']);
      }
    }));
  }
  // private async createMime() {
  //   try {
  //     const user = this.authService.getCurrentUser();
  //     if (!user) throw new Error('No user logged in');

  //     this.mimeId = await this.pastMimesService.createMime(this.prompt, this.selectedHost!.hid);

  //     // Start polling for status
  //     this.statusSubscription = this.pastMimesService.pollMimeStatus(user.uid, this.mimeId)
  //       .subscribe({
  //         next: (status) => {
  //           this.status = status;
  //           if (status === 'Complete') {
  //             // Handle completion (maybe show the video)
  //             console.log('Mime generation completed');
  //           } else if (status === 'Error') {
  //             this.error = 'Failed to generate mime. Please try again.';
  //           }
  //         },
  //         error: (error) => {
  //           console.error('Error polling mime status:', error);
  //           this.error = 'Error checking mime status';
  //         }
  //       });
  //   } catch (error) {
  //     console.error('Error creating mime:', error);
  //     this.error = 'Failed to create mime. Please try again.';
  //   }
  // }

  onLike() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
    }
    if (this.mime) {
      this.mime.rating = this.liked ? 1 : 0;
    }
  }

  onDislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
    }
    if (this.mime) {
      this.mime.rating = this.disliked ? -1 : 0;
    }
  }

  onBack() {
    window.history.back();
  }

  async onClickFeedback() {
    if (!this.feedbackText.trim()) {
      alert('Please enter feedback before submitting.');
      return;
    }

    if (!this.userId || !this.userEmail || !this.username) {
      console.error('Missing required user data:', {
        userId: this.userId,
        username: this.username,
        userEmail: this.userEmail,
      });
      return;
    }

    await this.feedbackService.writeFeedback(
      this.userId,
      this.username,
      this.mime?.mid || '',
      this.feedbackText,
      this.mime?.rating || 0,
      this.userEmail
    );

    this.feedbackText = ''; // Clear input field
  }

}
