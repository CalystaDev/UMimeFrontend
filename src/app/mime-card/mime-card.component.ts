import { Component, Input } from '@angular/core';
import { PastMimesService } from '../../services/past-mimes.service';
import { Mime } from '../../services/mimes.model';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { Host } from '../../services/hosts.model';
// import { Host } from '../../services/hosts.model';

@Component({
  selector: 'app-mime-card',
  standalone: true,
  imports: [],
  templateUrl: './mime-card.component.html',
  styleUrls: ['./mime-card.component.css']
})
export class MimeCardComponent {
  @Input() title!: string;
  @Input() host!: Host;
  @Input() mid!: string;

  constructor(
    private mimeService: PastMimesService, 
    private router: Router,
    private authService: AuthService
  ) {}

  onCardClick(): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        console.log('User is signed in, navigating to mime-new');
        
        this.navigateToMimeNew();
        // this.router.navigate(['/mime-new'], { state: { host: this.host }});
      } else {
        console.log('User is not signed in, initiating sign-in process');
        this.authService.googleSignIn().then(() => {
          console.log('Sign-in successful, navigating to mime-new');
          this.navigateToMimeNew();
        }).catch(error => {
          console.error('Sign-in failed', error);
        });
      }
    });
  }

  navigateToMimeNew(): void {
    if (this.mid) {
      console.log(`Navigating to existing mime with mid: ${this.mid}`);
      this.router.navigate(['/mime-new', this.mid]); 
    } else {
      console.error('No mime id provided');
    }
  }
}