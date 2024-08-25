import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MimeCardComponent } from '../mime-card/mime-card.component';
import { MimeNewComponent } from '../mime-new/mime-new.component';
import { MatIconModule } from '@angular/material/icon';
import { Mime, PastMimesService } from '../../services/past-mimes.service';
import { FormsModule } from '@angular/forms';
import { HostsService, Host } from '../../services/hosts.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MimeCardComponent, MimeNewComponent, MatIconModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 
  mimes: Mime[] = [];
  hosts: Host[] = [];
  mimePrompt: string = ' '
  selectedHost: string = ''

  // hosts: string[] = ['Host 1', 'Host 2', 'Host 3', 'Host 4'];

  constructor(private mimeService: PastMimesService, private hostsService: HostsService,) {}

  ngOnInit() {
    this.mimes = this.mimeService.getMimes();
    this.hosts = this.hostsService.getHosts();
  }

  onLetsMimeClick() {
    console.log('Selected Host:', this.selectedHost);
    
    if (this.selectedHost) {
      alert(`Let's mime with ${this.selectedHost}!`);
    } else {
      alert('Please select a host before proceeding.');
    }
  }
}