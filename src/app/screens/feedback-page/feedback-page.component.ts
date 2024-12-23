import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Feedback, FeedbackService } from '../../../services/feedback.model';
import { FeedbackPostComponent } from './feedback-post/feedback-post.component';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [MatIcon, CommonModule, FeedbackPostComponent],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.css'
})
export class FeedbackPageComponent implements OnInit{
  feedbacks$: Observable<Feedback[]> | undefined;

  constructor(private router: Router, private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.feedbacks$ = this.feedbackService.getAllFeedback();
  }

  onPersonClick() {
    console.log('Person clicked');
  }

  onHomeClick() {
    console.log('Home clicked');
    this.router.navigate(['/']);
  }
}
