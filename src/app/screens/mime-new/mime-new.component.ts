import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Host } from '../../../services/hosts.model';
import { FeedbackService } from '../../../services/feedback.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './mime-new.component.html',
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent {
  selectedHost: Host | null = null;
  username: string = '';
  userId: string = '';
  userEmail: string = '';

  sub = null;
  liked = false;
  disliked = false;

  feedbackText: string = ''; // Bind this to the input field

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private feedbackService: FeedbackService) {}

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
