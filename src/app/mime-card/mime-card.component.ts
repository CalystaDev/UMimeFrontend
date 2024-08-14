import { Component, Input } from '@angular/core';
import { PastMimesService, Mime } from '../../services/past-mimes.service';

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  templateUrl: './mime-card.component.html',
  styleUrl: './mime-card.component.css'
})
export class MimeCardComponent {
  @Input() topic!: string;
  @Input() host!: string;

  constructor(private mimeService: PastMimesService) {}

  // If you need to use the service to get mimes, you can add a method like this:
  getMimes(): Mime[] {
    return this.mimeService.getMimes();
  }
}