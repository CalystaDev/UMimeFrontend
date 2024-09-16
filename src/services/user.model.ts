import { Mime } from "./mimes.model";

export interface User {
    createdAt: Date;
    displayName?: string;
    email: string;
    lastSignedIn?: Date;
    mimes?: Mime[];
}