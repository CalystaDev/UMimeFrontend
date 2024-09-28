import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../app/environment';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: any;
  private db: any;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    console.log('Initializing AuthService');
    const firebaseConfig = environment;
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    console.log('Firebase initialized');

    this.auth.onAuthStateChanged((user: User | null) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      this.userSubject.next(user);
    });
  }

  async googleSignIn(): Promise<void> {
    console.log('Attempting Google Sign In');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Signed in successfully', user.uid);
      
      await this.createUserDocument(user);
      
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error during sign in', error);
    }
  }

  private async createUserDocument(user: User): Promise<void> {
    console.log('Attempting to create/update user document for:', user.uid);
    const userRef = doc(this.db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('Creating new user document');
        const userData = {
          createdAt: new Date(),
          displayName: user.displayName || '',
          email: user.email || '',
          lastSignedIn: new Date(),
          profilePhotoURL: user.photoURL || '',
          mimes: []
        };
        await setDoc(userRef, userData);
        console.log('New user document created successfully');
      } else {
        console.log('Updating existing user document');
        await setDoc(userRef, { lastSignedIn: new Date() }, { merge: true });
        console.log('User document updated successfully');
      }
    } catch (error) {
      console.error('Error creating/updating user document:', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Signed out successfully');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during sign out', error);
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}