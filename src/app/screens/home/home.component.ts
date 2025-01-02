import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MimeCardComponent } from '../../mime-card/mime-card.component';
import { MimeNewComponent } from '../../mime-new/mime-new.component';
import { MatIconModule } from '@angular/material/icon';
import { PastMimesService } from '../../../services/past-mimes.service';
import { FormsModule } from '@angular/forms';
import { Mime } from '../../../services/mimes.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';  // Alias for Firebase User
import { User } from '../../../services/user.model';
import { Host, HostService } from '../../../services/hosts.model';
import { HostCardComponent } from "../host-directory/host-card/host-card.component";
import { Video, VideoService } from '../../../services/video.model';
import { VideoCardComponent } from './video-card/video-card.component';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MimeCreationService } from '../../../services/mime-creation.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MimeCardComponent, MimeNewComponent, MatIconModule, FormsModule, HostCardComponent, VideoCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mimes: Mime[] = [];
  mimePrompt: string = ''
  selectedHost: Host | null = null;
  user$: Observable<FirebaseUser | null>;
  logoutConfirm: boolean = false;
  selectedVideo: Video | null = null;

  videos: Video[] = [];
  hosts: Host[] = [];

  userId: string = '';
  userName: string = '';
  userEmail: string = '';

  constructor(
    private mimeService: PastMimesService,
    private authService: AuthService,
    private hostService: HostService,
    private videoService: VideoService,
    private router: Router,
    private mimeCreationService: MimeCreationService,
    private firestore: Firestore
  ) {
    this.user$ = this.authService.user$;
  }


  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {

        this.userId = user.uid;
        this.userName = user.displayName || '';
        this.userEmail = user.email || '';

        this.authService.getUserMimes(user.uid).then(mimes => {
          console.log('Mimes:', mimes);
          this.mimes = mimes;
        }) 
      }
    })
    this.hostService.getHosts().subscribe(hosts => {
      this.hosts = hosts;
      console.log('Hosts:', this.hosts);
    });

    this.videoService.getVideos().subscribe(videos => {
      this.videos = videos;
      console.log('Videos:', this.videos);
    });

  }

  async onLetsMimeClick() {
    console.log('Selected Host:', this.selectedHost?.hid, this.selectedHost?.description);
    console.log('Selected Video:', this.selectedVideo?.vid, this.selectedVideo?.title);
    if (this.selectedHost && this.selectedVideo) {
      const firebaseUser = this.authService.getCurrentUser();
      if (!firebaseUser) return;
  
      const userRef = doc(this.firestore, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return;
  
      const userData = userSnap.data();
      const user: User = {  // Now using your custom User interface
        uid: firebaseUser.uid,
        createdAt: userData['createdAt'].toDate(),
        displayName: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        lastSignedIn: new Date(),
        profilePictureURL: firebaseUser.photoURL || '',
        mimes: userData['mimes'] || []
      };
  
      const initialMime: Mime = {
        mid: '',
        createdAt: new Date(),
        title: '',
        duration: 0,
        hosts: [this.selectedHost],
        rating: 0,
        prompt: this.mimePrompt,
        script: '',
        status: 'Processing'
      };
  
      this.mimeCreationService.setMimeState({
        user,
        mime: initialMime,
        prompt: this.mimePrompt,
        host: this.selectedHost,
        backgroundVideo: this.selectedVideo
      });
  
      this.router.navigate(['/mime-new']);
    }
  }

  logSelectedHost() {
    console.log('Selected Host:', this.selectedHost);
  }

  logSelectedVideo() {
    console.log('Selected Video:', this.selectedVideo);
  }

  onPersonClick() {
    this.authService.googleSignIn().then(() => {
      console.log('Google Sign-in successful');
    }).catch(error => {
      console.error('Google Sign-in failed', error);
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      console.log('Sign-out successful');

      console.log(this.user$);

      this.logoutConfirm = false;
      this.mimes = [];

    }).catch(error => {
      console.error('Sign-out failed', error);
    });
  }

  onHostDirectoryClick() {
    this.router.navigate(['/host-directory']);
  }


  getHostNames(mime: Mime): string {
    return this.mimeService.getHostNames(mime.hosts);
  }
  toggleLogout() {
    if (this.user$) {
      this.logoutConfirm = true;
    }
    
  }

  cancelSignOut() {
    this.logoutConfirm = false; // Hide confirmation dialog
  }

  selectHost(host: Host): void {
    this.selectedHost = host;
    console.log('Selected Host:', this.selectedHost);
  }

  selectVideo(video: Video): void {
    this.selectedVideo = video;
    console.log('Selected Video:', this.selectedVideo);
  }
}