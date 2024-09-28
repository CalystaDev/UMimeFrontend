import { Injectable } from '@angular/core';
import { Mime } from './mimes.model';



@Injectable({
  providedIn: 'root'
})
export class PastMimesService {
  private mimes: Mime[] = [
    {
    createdAt: new Date(2018,  3,  14),
    title: "How to make mac n cheese",
    duration: 15,
    hID: "someURL",
    rating: 5,
    script:"someScrupt", 
    status: "someStatus",
    videoUrl: "someUrl",
    prompt: "somePrompt"
    },
    // Add more projects as needed
  ];

  constructor() { }

  getMimes(): Mime[] {
    return this.mimes;
  }
}

