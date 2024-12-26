import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css'],
})
export class VideoCardComponent {
  @Input() thumbnail!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() uses!: number;
  @Input() url!: string;
  @Input() tags: string[] = [];

  // Method to attach the loop logic when video metadata is loaded
  onLoadedMetadata(video: HTMLVideoElement): void {
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 3) {
        video.currentTime = 0; // Reset to the start after 3 seconds
      }
    });
  }
}