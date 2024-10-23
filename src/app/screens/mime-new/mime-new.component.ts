import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Host } from '../../../services/hosts.model';


@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mime-new.component.html',
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent {
  selectedHost: Host | null = null;
  sub = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;
    if (state) {
      this.selectedHost = state.host as Host;
      console.log('Selected Host in Mime New:', state.host.hid, state.host.description);
    }
    console.log('Selected Host in Mime New:', this.selectedHost);
  }

  liked = false;
  disliked = false;

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
}
