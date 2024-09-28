import { Component, Input } from '@angular/core';
import { PastMimesService } from '../../services/past-mimes.service';
import { Mime } from '../../services/mimes.model';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  templateUrl: './mime-card.component.html',
  styleUrls: ['./mime-card.component.css']
})
export class MimeCardComponent {
  @Input() title!: string;
  @Input() host!: string;

  constructor(private mimeService: PastMimesService, private router: Router) {}

  // If you need to use the service to get mimes, you can add a method like this:
  getMimes(): Mime[] {
    return this.mimeService.getMimes();
  }

  onCardClick(): void {
    console.log('Card clicked');
    this.router.navigate(['/mime-new']);
  }
}