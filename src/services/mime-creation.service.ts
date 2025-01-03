import { User } from './user.model';
import { Host } from './hosts.model';
import { Video } from './video.model';
import { Mime } from './mimes.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Audio } from './audio.model';

@Injectable({
  providedIn: 'root'
})
export class MimeCreationService {
  private mimeStateSubject = new BehaviorSubject<{
    user: User | null,
    mime: Mime | null,
    prompt: string,
    host: Host | null,
    backgroundVideo: Video | null,
    backgroundAudio: Audio | null
  }>({
    user: null,
    mime: null,
    prompt: '',
    host: null,
    backgroundVideo: null,
    backgroundAudio: null
  });

  mimeState$ = this.mimeStateSubject.asObservable();

  setMimeState(state: {
    user: User,  // Required when setting state
    mime: Mime | null,
    prompt: string,
    host: Host,
    backgroundVideo: Video,
    backgroundAudio: Audio
  }) {
    this.mimeStateSubject.next(state);
  }

  clearMimeState() {
    this.mimeStateSubject.next({
      user: null,
      mime: null,
      prompt: '',
      host: null,
      backgroundVideo: null,
      backgroundAudio: null
    });
  }

  getMimeState() {
    return this.mimeStateSubject.value;
  }  
}