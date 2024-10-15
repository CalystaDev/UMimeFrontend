import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Observable, map } from "rxjs";


export interface Host {
    id: string;
    apiMappedID: string;
    description: string;
    profilePictureURL: string;
    tags: string[];
    wpm: number;
    uses: number;
}

@Injectable({
    providedIn: 'root' // This makes the service available app-wide
})

export class HostService {
    firestore: Firestore = inject(Firestore);
    hosts$: Observable<Host[]>;

    constructor() {
        const hostCollection = collection(this.firestore, 'hosts');
        this.hosts$ = collectionData(hostCollection, { idField: 'id'}).pipe(
            map((hosts: any[]) => {
                return hosts.map(host => {
                    return {
                        id: host.id,
                        apiMappedID: host.apiMappedID,
                        description: host.description,
                        profilePictureURL: host.profilePhotoURL,
                        tags: host.tags,
                        wpm: host.wpm,
                        uses: host.uses
                    }
                })
            })
        )
    }

    getHosts(): Observable<Host[]> {
        return this.hosts$;
    }

}