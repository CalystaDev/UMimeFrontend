import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-host-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-card.component.html',
  styleUrl: './host-card.component.css'
})
export class HostCardComponent {
  @Input() hostPhotoURL!: string;
  @Input() hostDisplayName!: string;
  @Input() uses!: number; 
  @Input() tags: string[] = [];

}
