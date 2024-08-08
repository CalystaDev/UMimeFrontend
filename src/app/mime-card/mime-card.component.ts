import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  templateUrl:'./mime-card.component.html',
  styleUrl: './mime-card.component.css'
})
export class MimeCardComponent {
  @Input() title!: string;
  @Input() host!: string;
}
