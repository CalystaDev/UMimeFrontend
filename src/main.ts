import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


const firebaseConfig = {
  apiKey: "AIzaSyD1s9FbCD4PJpS3izmOJGDQWHaorRgG75w",
  authDomain: "umime-ba35e.firebaseapp.com",
  databaseURL: "https://umime-ba35e-default-rtdb.firebaseio.com",
  projectId: "umime-ba35e",
  storageBucket: "umime-ba35e.appspot.com",
  messagingSenderId: "1010927570704",
  appId: "1:1010927570704:web:6c08084319e8c5a2a3df95",
  measurementId: "G-GB1MYZ6QD8"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth())
  ])
  ]
}).catch(err => console.error(err));