import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../app/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: any;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    // Initialize Firebase
    const firebaseConfig = environment;
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    // Listen for auth state changes
    this.auth.onAuthStateChanged((user: User | null) => {
      this.userSubject.next(user);
    });
  }

  async googleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      // The signed-in user info is in result.user
      console.log('Signed in successfully', result.user);
      this.router.navigate(['/dashboard']); // Navigate to dashboard or desired route
    } catch (error) {
      console.error('Error during sign in', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Signed out successfully');
      this.router.navigate(['/']); // Navigate to home or login page
    } catch (error) {
      console.error('Error during sign out', error);
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}