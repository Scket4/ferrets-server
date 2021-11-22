import { Document } from 'mongoose';

export interface Auth extends Document {
    username: string;
    email: string;
    readonly password: string;
}