import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MimeCardComponent } from '../mime-card/mime-card.component';
import { MimeNewComponent } from '../mime-new/mime-new.component';
import { MatIconModule } from '@angular/material/icon';
import { Mime, PastMimesService } from '../../services/past-mimes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MimeCardComponent, MimeNewComponent, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 
  mimes: Mime[] = [];

  constructor(private mimeService: PastMimesService) {}

  ngOnInit() {
    this.mimes = this.mimeService.getMimes();
  }
}