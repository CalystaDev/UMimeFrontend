import { Injectable } from '@angular/core';

export interface Host {
  name: string;
  desc: string;
  wpm: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class HostsService {
    //in the future, the hosts will be pulled from 11labs. This is temporary for front-end testing purposes
  private hosts: Host[] = [
    {
      name: 'Thomas the \'ole',
      desc: 'Old Irish Man',

      wpm: 5
    },
    {
      name: 'Bish from the Bay',
      desc: 'Old Irish Man',

      wpm: 6
    },
    {
        name: 'Discord Mod',
        desc: 'Old Irish Man',

        wpm: 6
    },
    {
        name: 'Big Bertha ',
        desc: 'Old Irish Man',

        wpm: 6
    },
  ];

  constructor() { }

  getHosts(): Host[] {
    return this.hosts;
  }
}