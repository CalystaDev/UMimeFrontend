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
import { User } from 'firebase/auth';
import { Host, HostService } from '../../../services/hosts.model';
import { HostCardComponent } from "../host-directory/host-card/host-card.component";
import { Video, VideoService } from '../../../services/video.model';
import { VideoCardComponent } from './video-card/video-card.component';


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
  user$: Observable<User | null>;
  logoutConfirm: boolean = false;
  selectedVideo: Video | null = null;

  videos: Video[] = [];
  hosts: Host[] = [];

  // Dummy Video Data
  videoData: Video[] = [
    {
      vid: '1',
      title: 'Video 1',
      description: 'Description 1',
      thumbnail: 'https://via.placeholder.com/150',
      url: 'https://www.youtube.com/watch?v=1',
      tags: ['tag1', 'tag2'],
      uses: 1
    },
    {
      vid: '2',
      title: 'Video 2',
      description: 'Description 2',
      thumbnail: 'https://via.placeholder.com/150',
      url: 'https://www.youtube.com/watch?v=2',
      tags: ['tag1', 'tag2'],
      uses: 2
    },
    {
      vid: '3',
      title: 'Video 3',
      description: 'Description 3',
      thumbnail: 'https://via.placeholder.com/150',
      url: 'https://www.youtube.com/watch?v=3',
      tags: ['tag1', 'tag2'],
      uses: 3
    }
  ]; 

  constructor(
    private mimeService: PastMimesService,
    private authService: AuthService,
    private hostService: HostService,
    private videoService: VideoService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }


  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
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

  onLetsMimeClick() {
    console.log('Selected Host:', this.selectedHost?.hid, this.selectedHost?.description);
    console.log('Selected Video:', this.selectedVideo?.vid, this.selectedVideo?.title);

    if (this.selectedHost && this.selectedVideo) {
      this.router.navigate(['/mime-new'], { state: { host: this.selectedHost}});
    } else {
      alert('Please select a host before proceeding.');
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