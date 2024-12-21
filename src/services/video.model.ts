import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Observable, map } from "rxjs";

export interface Video {
    vid: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    tags: string[];
    uses: number;
}

@Injectable({
    providedIn: 'root'
})

export class VideoService {
    firestore: Firestore = inject(Firestore);
    videos$: Observable<Video[]>;

    constructor() {
        const videoCollection = collection(this.firestore, 'videos');
        this.videos$ = collectionData(videoCollection, { idField: 'id'}).pipe(
            map((videos: any[]) => {
                return videos.map(video => {
                    return {
                        vid: video.id,
                        title: video.title,
                        description: video.description,
                        url: video.url,
                        thumbnail: video.thumbnail,
                        tags: video.tags,
                        uses: video.uses
                    }
                })
            })
        )
    }

    getVideos(): Observable<Video[]> {
        return this.videos$;
    }

}