import { Component, Input } from '@angular/core';
import { PastMimesService } from '../../services/past-mimes.service';
import { Mime } from '../../services/mimes.model';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

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

  constructor(
    private mimeService: PastMimesService, 
    private router: Router,
    private authService: AuthService
  ) {}

  getMimes(): Mime[] {
    return this.mimeService.getMimes();
  }

  onCardClick(): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        console.log('User is signed in, navigating to mime-new');
        this.router.navigate(['/mime-new']);
      } else {
        console.log('User is not signed in, initiating sign-in process');
        this.authService.googleSignIn().then(() => {
          console.log('Sign-in successful, navigating to mime-new');
          this.router.navigate(['/mime-new']);
        }).catch(error => {
          console.error('Sign-in failed', error);
        });
      }
    });
  }
}