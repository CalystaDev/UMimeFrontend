import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-mime-new',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <button class="mime-button"> 
      <mat-icon>add</mat-icon>
      <h2> New Mime </h2>
    </button>
  `,
  styleUrl: './mime-new.component.css'
})
export class MimeNewComponent {
}
