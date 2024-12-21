import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css'
})
export class VideoCardComponent {
  @Input() thumbnail!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() uses!: number;
  @Input() tags: string[] = [];
}
