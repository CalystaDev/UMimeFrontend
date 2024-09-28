import { Component, Input } from '@angular/core';
import { PastMimesService } from '../../services/past-mimes.service';
import { Mime } from '../../services/mimes.model';

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  templateUrl: './mime-card.component.html',
  styleUrl: './mime-card.component.css'
})
export class MimeCardComponent {
  @Input() title!: string;
  @Input() host!: string;

  constructor(private mimeService: PastMimesService) {}

  // If you need to use the service to get mimes, you can add a method like this:
  getMimes(): Mime[] {
    return this.mimeService.getMimes();
  }
}