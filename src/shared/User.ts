import mongoose, {PassportLocalSchema, Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    name: String,
    email: String
});


userSchema.plugin(passportLocalMongoose, { usernameField: 'name'});

const model = mongoose.model('User', userSchema as PassportLocalSchema)

export default model;
