import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
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
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth())
    ])
  ]
};
