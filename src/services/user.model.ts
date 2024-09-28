import { Mime } from "./mimes.model";

export interface User {
    createdAt: Date;
    description: string;
    email: string;
    lastSignedIn?: Date;
    mimes?: Mime[];
    profilePictureURL: string;
}