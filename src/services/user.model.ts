import { Mime } from "./mimes.model";

export interface User {
    id: string;
    createdAt: Date;
    displayName: string;
    email: string;
    lastSignedIn?: Date;
    mimes?: Mime[];
    profilePictureURL: string;
}