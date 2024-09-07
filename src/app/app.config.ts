import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics } from "firebase/analytics";

import { routes } from './app.routes';

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
const app = initializeApp(firebaseConfig);
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};

