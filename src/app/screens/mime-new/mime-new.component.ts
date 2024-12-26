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

@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './mime-new.component.html',
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent implements OnInit, OnDestroy {
  selectedHost: Host | null = null;
  username: string = '';
  userId: string = '';
  userEmail: string = '';

  sub = null;

  liked = false;
  disliked = false;

  feedbackText: string = ''; // Bind this to the input field

  prompt: string = '';
  status: string = 'Processing';
  error: string | null = null;
  mimeId: string | null = null;
  private statusSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pastMimesService: PastMimesService,
    private authService: AuthService,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    console.log("Extras State", this.router.getCurrentNavigation()?.extras.state);
    console.log("History State", history.state);
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;
    if (state) {
      console.log('State:', state);
      this.selectedHost = state.host as Host;

      this.username = state.userName;
      this.userId = state.uid;
      this.userEmail = state.email;

      this.prompt = state.prompt;
      console.log('Selected Host in Mime New:', this.selectedHost?.hid, this.selectedHost?.description);
      
      if (this.selectedHost && this.prompt) {
        this.createMime();
      }
    }
  }
  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  private async createMime() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) throw new Error('No user logged in');
      
      this.mimeId = await this.pastMimesService.createMime(this.prompt, this.selectedHost!.hid);
      
      // Start polling for status
      this.statusSubscription = this.pastMimesService.pollMimeStatus(user.uid, this.mimeId)
        .subscribe({
          next: (status) => {
            this.status = status;
            if (status === 'Complete') {
              // Handle completion (maybe show the video)
              console.log('Mime generation completed');
            } else if (status === 'Error') {
              this.error = 'Failed to generate mime. Please try again.';
            }
          },
          error: (error) => {
            console.error('Error polling mime status:', error);
            this.error = 'Error checking mime status';
          }
        });
    } catch (error) {
      console.error('Error creating mime:', error);
      this.error = 'Failed to create mime. Please try again.';
    }
  }

  onLike() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
    }
  }

  onDislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
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
      this.selectedHost?.hid || '',
      this.feedbackText,
      this.liked ? 1 : this.disliked ? -1 : 0,
      this.userEmail
    );
  
    this.feedbackText = ''; // Clear input field
  }
  
}
