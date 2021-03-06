import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    name: String,
    surname: String,
    about: String,
    password: String,
    status: Object,
    profile_photo: String,
    profile_likes: Array,
})