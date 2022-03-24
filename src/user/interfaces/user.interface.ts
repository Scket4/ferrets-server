import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    name?: string,
    surname?: string,
    profile_photo?: string,
    profile_likes?: string[],
    readonly password: string;
}