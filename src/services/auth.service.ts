import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment, apiUrl } from '../app/environment';
import { getFirestore, doc, setDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { Mime } from './mimes.model';
import { Host } from './hosts.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: any;
  private db: any;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();
  private apiUrl = apiUrl;  // Your Python backend URL

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
      console.log('User document created/updated successfully for:', user.uid);
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
          id: user.uid,
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

  async getUserMimes(userId: string): Promise<Mime[]> {
    console.log('Fetching mimes for user:', userId);
    const userRef = doc(this.db, 'users', userId);
    console.log('User ref:', userRef.path);
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        console.log('User document does not exist');
        return [];
      }

      const userData = userSnap.data();
      console.log('User data:', userData);
      const mimes: Mime[] = userData['mimes'] || [];
      for (const mime of mimes) {
        console.log('Mime:', mime);
        if (mime.hosts) {
          mime.hosts = await this.resolveHosts(mime.hosts);
        }
      }

      console.log('User mimes:', mimes);
      return mimes;
    } catch (error) {
      console.error('Error fetching user mimes:', error);
      return [];
    }
  }

  private async resolveHosts(hostIds: any): Promise<Host[]> {
    const hosts: Host[] = [];
    for (const hostId of hostIds) {
      const hostRef = doc(this.db, 'hosts', hostId);
      console.log('Host ref:', hostRef.path);
      try {
        const hostSnap = await getDoc(hostRef);
        if (hostSnap.exists()) {
          const hostData = hostSnap.data();
          console.log('Host data:', hostData);
          const host: Host = {
            hid: hostSnap.id,
            displayName: hostData['description'],
            profilePictureURL: hostData['profilePictureURL'],
            tags: hostData['tags'],
            wpm: hostData['wpm'],
            uses: hostData['uses'],
            apiMappedID: hostData['apiMappedId'],
            description: hostData['description'],
          };
          hosts.push(host);
          
        }
      } catch (error) {
        console.error('Error fetching host:', error);
      }
    }
    console.log('Resolved hosts:', hosts);
    return hosts;
  }

}