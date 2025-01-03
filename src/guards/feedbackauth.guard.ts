import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth'; // Firebase Auth
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class FeedbackAuthGuard implements CanActivate {

    // List of allowed emails
    ALLOWED_EMAILS = ['umimedev@gmail.com', 'calystadev@gmail.com'];
    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        const user = this.authService.getCurrentUser();

        if (!user) {
            // If the user is not logged in, redirect to the home page
            this.router.navigate(['/']);
            return false;
        }

        const email = user.email;
        if (email && this.ALLOWED_EMAILS.includes(email)) {
            return true; // Allow access
        } else {
            // Redirect unauthorized users
            this.router.navigate(['/']);
            return false;
        }
    }
}
