import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mime-new.component.html',
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent {
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
