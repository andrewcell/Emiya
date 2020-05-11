import mongoose, {PassportLocalSchema, Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export type UserDocument = mongoose.Document & {
    username: string;
    email: string;
    admin: boolean;
}

const userSchema = new Schema({
    username: String,
    email: String,
    admin: Boolean
}, {collection: 'users'});


userSchema.plugin(passportLocalMongoose, { usernameField: 'username'});

const model = mongoose.model<UserDocument>('User', userSchema as PassportLocalSchema)

export default model;
