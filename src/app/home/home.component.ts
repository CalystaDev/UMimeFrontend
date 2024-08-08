import { Component } from '@angular/core';
import { MimeCardComponent } from '../mime-card/mime-card.component';
import { MimeNewComponent } from '../mime-new/mime-new.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MimeCardComponent, MimeNewComponent, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  
}
