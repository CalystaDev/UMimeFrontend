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
      topic: 'Intro to Assembly: LC-3',
      host: 'Kamala Harris'
    },
    {
      topic: 'Global IT Outage 2024 from Crowdstrike',
      host: 'Snoop Dogg'
    },
    // Add more projects as needed
  ];

  constructor() { }

  getMimes(): Mime[] {
    return this.mimes;
  }
}