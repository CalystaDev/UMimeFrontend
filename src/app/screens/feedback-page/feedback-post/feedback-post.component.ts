import { Component, Input } from '@angular/core';
import { Feedback } from '../../../../services/feedback.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-post.component.html',
  styleUrl: './feedback-post.component.css'
})
export class FeedbackPostComponent {
  @Input() feedback!: Feedback;

  constructor(private router: Router) {}

  viewMime(): void {
    this.router.navigate(['/mime-new'], {
      queryParams: {
        uid: this.feedback.uid,
        userName: this.feedback.userName,
        mid: this.feedback.mid
      }
    });
  }
}