import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})