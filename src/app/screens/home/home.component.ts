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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MimeCardComponent, MimeNewComponent, MatIconModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mimes: Mime[] = [];
  mimePrompt: string = ' '
  selectedHost: string = ''
  user$: Observable<User | null>;

  hosts: string[] = ['Host 1', 'Host 2', 'Host 3', 'Host 4'];

  constructor(
    private mimeService: PastMimesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.mimes = this.mimeService.getMimes();
  }

  onLetsMimeClick() {
    console.log('Selected Host:', this.selectedHost);

    if (this.selectedHost) {
      this.router.navigate(['/mime-new']);
    } else {
      alert('Please select a host before proceeding.');
    }
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
    }).catch(error => {
      console.error('Sign-out failed', error);
    });
  }

  onHostDirectoryClick() {
    this.router.navigate(['/host-directory']);
  }
}