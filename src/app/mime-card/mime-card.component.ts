import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  template: `
    <div class="mime-card">
      <h3>{{ title }}</h3>
      <p>Hosts: <b>{{ host }}</b></p>
    </div>
  `,
  styleUrl: './mime-card.component.css'
})
export class MimeCardComponent {
  @Input() title!: string;
  @Input() host!: string;
}
