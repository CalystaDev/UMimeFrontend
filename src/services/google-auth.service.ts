import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
})
export class GoogleAuthService {
    private auth: AngularFireAuth | null = null;
    private firestore: AngularFirestore | null = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        angularFireAuth: AngularFireAuth,
        angularFirestore: AngularFirestore
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.auth = angularFireAuth;
            this.firestore = angularFirestore;
        }
    }

    signInWithGoogle(): Promise<any> {
        if (this.auth) {
            return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        }
        return Promise.reject('Auth not available on server');
    }

    signOut(): Promise<void> {
        if (this.auth) {
            return this.auth.signOut();
        }
        return Promise.resolve();
    }

    getUser(): Observable<any> {
        if (this.auth) {
            return this.auth.authState;
        }
        return of(null);
    }

    isLoggedIn(): Observable<boolean> {
        if (this.auth) {
            return new Observable(observer => {
                this.auth!.onAuthStateChanged(user => {
                    observer.next(!!user);
                });
            });
        }
        return of(false);
    }

    addMime(userId: string, mimeData: any): Promise<any> {
        if (this.firestore) {
            return this.firestore.collection('users').doc(userId).collection('mimes').add(mimeData);
        }
        return Promise.reject('Firestore not available on server');
    }
}