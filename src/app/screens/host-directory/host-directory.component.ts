import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { HostCardComponent } from './host-card/host-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HostService } from '../../../services/hosts.model';
import { Observable } from 'rxjs';
import { Host } from '../../../services/hosts.model';


@Component({
  selector: 'app-host-directory',
  standalone: true,
  imports: [MatIcon, HostCardComponent, CommonModule],
  templateUrl: './host-directory.component.html',
  styleUrl: './host-directory.component.css'
})
export class HostDirectoryComponent implements OnInit{
  hosts$: Observable<Host[]> | undefined;

  constructor(private router: Router, private hostService: HostService) {}

  ngOnInit() {
    this.hosts$ = this.hostService.getHosts();
  }

  onPersonClick() {
    console.log('Person clicked');
  }

  onHomeClick() {
    console.log('Home clicked');
    this.router.navigate(['/']);
  }
}
