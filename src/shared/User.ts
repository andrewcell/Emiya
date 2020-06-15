import mongoose, {PassportLocalSchema, Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export type UserDocument = mongoose.Document & {
    username: string;
    email: string;
    admin: boolean;
    hash: string;
    verifyHash: string;
    verified: boolean;
    myVillagers: string[];
    registerIp: string;
    registerUserAgent: string;
    registerDatetime: number;
    resetPasswordHash: string;
    resetPasswordTime: number;
    language: string;
}

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    admin: Boolean,
    verifyHash: String,
    verified: Boolean,
    myVillagers: [String],
    registerIp: String,
    registerUserAgent: String,
    registerDatetime: Number,
    resetPasswordHash: String,
    resetPasswordTime: Number,
    language: String
}, {collection: 'users'});


userSchema.plugin(passportLocalMongoose, { usernameField: 'username'});

const model = mongoose.model<UserDocument>('User', userSchema as PassportLocalSchema)

export {userSchema};
export default model;
