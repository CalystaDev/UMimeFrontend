import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, addDoc } from "@angular/fire/firestore";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Observable, map } from "rxjs";


export interface Feedback {
    fid: string;
    uid: string;
    userName: string;
    mid: string;
    main_description: string;
    rating: number;
    userEmail?: string;
    date?: Date;
}

@Injectable({
    providedIn: 'root' // This makes the service available app-wide
})

export class FeedbackService {
    firestore: Firestore = inject(Firestore);
    feedbacks$: Observable<Feedback[]>;

    constructor() {
        const feedbackCollection = collection(this.firestore, 'feedbacks');
        this.feedbacks$ = collectionData(feedbackCollection, { idField: 'id'}).pipe(
            map((feedbacks: any[]) => {
                return feedbacks.map(feedback => {
                    return {
                        fid: feedback.id,
                        uid: feedback.uid,
                        userName: feedback.userName,
                        mid: feedback.mid,
                        main_description: feedback.main_description,
                        rating: feedback.rating,
                        userEmail: feedback.userEmail,
                        date: feedback.date
                    }
                })
            })
        )
    }

    getAllFeedback(): Observable<Feedback[]> {
        const feedbackCollection = collection(this.firestore, 'feedbacks');
        return collectionData(feedbackCollection, { idField: 'fid' }).pipe(
            map((feedbacks: any[]) =>
              feedbacks.map(feedback => ({
                ...feedback,
                date: feedback.date ? new Date(feedback.date.seconds * 1000) : null // Convert Firestore Timestamp
              }))
            )
          );
    }

    async writeFeedback(
        uid: string,
        userName: string,
        mid: string,
        main_description: string,
        rating: number,
        email: string
      ) {
        console.log('Feedback Data:', {
          uid,
          userName,
          mid,
          main_description,
          rating,
          email,
        });
      
        if (!uid || !userName || !main_description || rating === undefined || !email) {
          console.error('Invalid feedback data:', { uid, userName, mid, main_description, rating, email });
          return Promise.reject('Invalid feedback data');
        }
      
        const feedbackCollection = collection(this.firestore, 'feedbacks');
        try {
          const fid = await addDoc(feedbackCollection, {
            uid,
            userName,
            mid,
            main_description,
            rating,
            email,
            date: new Date(),
          });
          console.log('Feedback written with ID:', fid.id);
        } catch (error) {
          console.error('Error writing feedback:', error);
        }
      }
      

}