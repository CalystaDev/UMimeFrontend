import { Host } from './hosts.model';

export interface Mime {
    mid: string;
    createdAt: Date;
    title: string;
    duration: number;
    hosts: Host[];
    rating: number;
    prompt: string;
    script: string;
    status?: string;
    videoUrl?: string;
}