import { Injectable } from '@angular/core';
import { Mime } from './mimes.model';
import { Host } from './hosts.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment, apiUrl } from '../app/environment';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Observable, throwError, catchError, map } from 'rxjs';
import { Video } from './video.model';



@Injectable({
  providedIn: 'root'
})
export class PastMimesService {
  private mimes: Mime[] = [
    {
    mid: "MimeID_1",
    createdAt: new Date(2018,  3,  14),
    title: "How to make mac n cheese",
    duration: 15,
    hosts: [],
    rating: 5,
    script:"someScrupt", 
    status: "someStatus",
    videoUrl: "someUrl",
    prompt: "somePrompt"
    },
    // Add more projects as needed
  ];

  private db = getFirestore();
  private apiUrl = apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMimes(): Mime[] {
    return this.mimes;
  }

  getHostNames(hosts: Host[]): string {
    return hosts.map(host => host.displayName).join(', ');
  }

  async addMimeToFirestore(mime: Mime) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('No user logged in');
    }
  
    const userRef = doc(this.db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
  
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
  
    const userData = userDoc.data();
    const mimes = userData['mimes'] || [];
  
    // Determine the next incremental ID
    const nextId = mimes.length > 0
      ? Math.max(
          ...mimes.map((m: Mime) => {
            const parts = m.mid.split('_');
            return parseInt(parts[1], 10);
          })
        ) + 1
      : 1;
  
    // Assign the new mime_id
    mime.mid = `${user.uid}_${nextId}`;
  
    // Add the new mime to the mimes array
    mimes.push(mime);
  
    // Update Firestore
    await updateDoc(userRef, { mimes });
  
    console.log('Mime added successfully:', mime);
    // return mimeID
    return mime.mid;
  }
  
  generateScript(prompt: string, host_mapped_id: string): Observable<{ video_id: string; title: string; script: string; }> {
    const payload = {
      "prompt": prompt,
      "voice_id": host_mapped_id
    };

    const endpoint = `${this.apiUrl}/generate_script`;

    return this.http.post<{ video_id: string; title: string; script: string }>(endpoint, payload).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error making POST request:', error);
        return throwError(() => new Error('Failed to generate script'));
      })
    );
  }

  generateImages(video_id: string): Observable<{ message: string; imagePaths: string[] }> {
    const endpoint = `${this.apiUrl}/generate_images/${video_id}`;
  
    return this.http.post<{ message: string; imagePaths: string[] }>(endpoint, {}).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error making POST request:', error);
        return throwError(() => new Error('Failed to generate images'));
      })
    );
  }

  generateAudio(video_id: string): Observable<{ message: string; audioPath: string }> {
    const endpoint = `${this.apiUrl}/generate_audio/${video_id}`;
  
    return this.http.post<{ message: string; audioPath: string }>(endpoint, {}).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error making POST request:', error);
        return throwError(() => new Error('Failed to generate audio'));
      })
    );
  }

  generateVideo(video_id: string): Observable<{ message: string; videoPath: string }> {
    const endpoint = `${this.apiUrl}/generate_video/${video_id}`;
  
    return this.http.post<{ message: string; videoPath: string }>(endpoint, {}).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error making POST request:', error);
        return throwError(() => new Error('Failed to generate video'));
      })
    );
  }
  



  // async createMime(prompt: string, host: Host, background_video: Video): Promise<string> {
  //   const user = this.authService.getCurrentUser();
  //   if (!user) {
  //     throw new Error('No user logged in');
  //   }

  //   // Get auth token
  //   const token = await user.getIdToken();

  //   const newMime : Mime = {
  //     mid: '', // will generate from Firestore
  //     createdAt: new Date(),
  //     title: '', // will generate from API
  //     duration: 0, // placeholder until video generates
  //     hosts: [host],
  //     rating: 0,
  //     prompt: prompt,
  //     script: '', // will generate from API
  //     status: 'generating...',
  //     videoUrl: '', // will generate from API
  //   };

  //   // Add the new mime to the user's mimes
  //   const userRef = doc(this.db, 'users', user.uid);
  //   const userDoc = await getDoc(userRef);
  //   if (!userDoc.exists()) {
  //     throw new Error('User document not found');
  //   }

  //   const userData = userDoc.data();
  //   const mimes = userData['mimes'] || [];
  //   mimes.push(newMime);

  //   await updateDoc(userRef, { mimes });

  //   // Create the mime using API
    
  //   try {
  //     // Call the backend API
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     const response = await this.http.post<{mimeId: string}>(`${this.apiUrl}/create_mime`, {
  //       prompt,
  //       hostId
  //     }, { headers }).toPromise();

  //     console.log('Mime creation initiated:', response);
  //     return response!.mimeId;

  //   } catch (error) {
  //     console.error('Error creating mime:', error);
  //     throw error;
  //   }
  // }

  pollMimeStatus(userId: string, mimeId: string): Observable<string> {
    return new Observable(subscriber => {
      const checkStatus = async () => {
        try {
          const status = await this.getMimeStatus(userId, mimeId);
          subscriber.next(status);
          
          if (status === 'Complete' || status === 'Error') {
            subscriber.complete();
          }
        } catch (error) {
          subscriber.error(error);
        }
      };

      const intervalId = setInterval(checkStatus, 5000); // Check every 5 seconds
      
      // Initial check
      checkStatus();
      
      // Cleanup
      return () => {
        clearInterval(intervalId);
      };
    });
  }
    private async getMimeStatus(userId: string, mimeId: string): Promise<string> {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
      
      const userData = userDoc.data();
      const mimes = userData['mimes'] || [];
      const mime = mimes.find((m: Mime) => m.mid === mimeId);
      
      if (!mime) {
        throw new Error('Mime not found');
      }
      
      return mime.status;
    }
  
    async updateMimeStatus(userId: string, mimeId: string, status: string, videoUrl?: string) {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;
      
      const userData = userDoc.data();
      const mimes = userData['mimes'] || [];
      const updatedMimes = mimes.map((mime: Mime) => {
        if (mime.mid === mimeId) {
          return {
            ...mime,
            status,
            ...(videoUrl && { videoUrl })
          };
        }
        return mime;
      });
  
      await updateDoc(userRef, { mimes: updatedMimes });
    }
  }


