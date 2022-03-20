import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    name?: string,
    surname?: string,
    readonly password: string;
}