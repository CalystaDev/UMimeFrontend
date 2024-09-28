import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { HostCardComponent } from './host-card/host-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-host-directory',
  standalone: true,
  imports: [MatIcon, HostCardComponent, CommonModule],
  templateUrl: './host-directory.component.html',
  styleUrl: './host-directory.component.css'
})
export class HostDirectoryComponent {
  constructor(private router: Router) {}

  onPersonClick() {
    console.log('Person clicked');
  }

  onHomeClick() {
    console.log('Home clicked');
    this.router.navigate(['/']);
  }

  hosts = [
    {
      hostPhotoURL: 'assets/mua_test.png',
      hostDisplayName: 'MUA #1',
      uses: 37000,
      tags: ['soft', 'cali girl vibes']
    },
    {
      hostPhotoURL: 'assets/sports.png',
      hostDisplayName: 'Sports #1',
      uses: 10000,
      tags: ['deep', 'fatherly', 'italian accent']
    },
    {
      hostPhotoURL: 'assets/rapper.png',
      hostDisplayName: 'Rapper #1',
      uses: 75000,
      tags: ['mumbler', 'side commentaries']
    },
    {
      hostPhotoURL: 'assets/chef.png',
      hostDisplayName: 'Master Chef #1',
      uses: 62000,
      tags: ['coach vibes', 'scary', 'judgy']
    },
    {
      hostPhotoURL: 'assets/teacher.png',
      hostDisplayName: 'Teacher #1',
      uses: 50000,
      tags: ['strict', 'wise', 'loves the kids']
    }
  ];


}
