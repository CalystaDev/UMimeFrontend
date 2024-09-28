import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  template: `
  <main>
    <!-- <section class="content">
      <app-home></app-home>
    </section> -->
    <router-outlet></router-outlet>
  </main>
`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'umime';
}
