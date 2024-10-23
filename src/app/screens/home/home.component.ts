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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MimeCardComponent, MimeNewComponent, MatIconModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mimes: Mime[] = [];
  mimePrompt: string = ''
  selectedHost: Host | null = null;
  user$: Observable<User | null>;
  logoutConfirm: boolean = false;

  hostNames: Host[] = [];

  constructor(
    private mimeService: PastMimesService,
    private authService: AuthService,
    private hostService: HostService,
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
      this.hostNames = hosts;
      console.log('Hosts:', this.hostNames);
    });

  }

  onLetsMimeClick() {
    console.log('Selected Host:', this.selectedHost?.hid, this.selectedHost?.description);

    if (this.selectedHost) {
      this.router.navigate(['/mime-new'], { state: { host: this.selectedHost}});
    } else {
      alert('Please select a host before proceeding.');
    }
  }

  logSelectedHost() {
    console.log('Selected Host:', this.selectedHost);
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
}