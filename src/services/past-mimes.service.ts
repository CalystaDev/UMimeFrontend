import { Injectable } from '@angular/core';

export interface Mime {
  topic: string;
  host: string;
}

@Injectable({
  providedIn: 'root'
})
export class PastMimesService {
  private mimes: Mime[] = [
    {
      topic: 'Project 1',
      host: 'This is the description for Project 1'
    },
    {
      topic: 'Project 2',
      host: 'This is the description for Project 2'
    },
    // Add more projects as needed
  ];

  constructor() { }

  getMimes(): Mime[] {
    return this.mimes;
  }
}