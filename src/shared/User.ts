import mongoose, {PassportLocalSchema, Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    username: String,
    email: String
}, {collection: 'users'});


userSchema.plugin(passportLocalMongoose, { usernameField: 'username'});

const model = mongoose.model('User', userSchema as PassportLocalSchema)

export default model;
