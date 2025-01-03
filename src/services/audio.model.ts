import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Observable, map } from "rxjs";

export interface Audio {
    aid: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    uses: number;
}

@Injectable({
    providedIn: 'root'
})

export class AudioService {
    firestore: Firestore = inject(Firestore);
    audios$: Observable<Audio[]>;

    constructor() {
        const audioCollection = collection(this.firestore, 'background_music');
        this.audios$ = collectionData(audioCollection, { idField: 'id'}).pipe(
            map((audios: any[]) => {
                return audios.map(audio => {
                    return {
                        aid: audio.id,
                        title: audio.title,
                        description: audio.description,
                        url: audio.url,
                        tags: audio.tags,
                        uses: audio.uses
                    }
                })
            })
        )
    }

    getAudios(): Observable<Audio[]> {
        return this.audios$;
    }

}