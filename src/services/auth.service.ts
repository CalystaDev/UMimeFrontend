import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);

  user$: Observable<firebase.User | null>;

  constructor() {
    this.user$ = this.afAuth.authState;
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out', error);
    }
  }
}