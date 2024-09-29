import { Injectable } from '@angular/core';
import { Mime } from './mimes.model';
import { Host } from './hosts.model';



@Injectable({
  providedIn: 'root'
})
export class PastMimesService {
  private mimes: Mime[] = [
    {
    id: "MimeID_1",
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

  constructor() { }

  getMimes(): Mime[] {
    return this.mimes;
  }

  getHostNames(hosts: Host[]): string {
    return hosts.map(host => host.displayName).join(', ');
  }
}

