import { Injectable } from '@angular/core';
import { Mime } from './mimes.model';
import { Host } from './hosts.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment, apiUrl } from '../app/environment';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';



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

  async createMime(prompt: string, hostId: string): Promise<string> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('No user logged in');
    }

    // Get auth token
    const token = await user.getIdToken();
    
    try {
      // Call the backend API
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<{mimeId: string}>(`${this.apiUrl}/create_mime`, {
        prompt,
        hostId
      }, { headers }).toPromise();

      console.log('Mime creation initiated:', response);
      return response!.mimeId;

    } catch (error) {
      console.error('Error creating mime:', error);
      throw error;
    }
  }
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


