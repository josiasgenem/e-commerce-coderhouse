import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user'},
    isThirdAuth: { type: Boolean, default: false, select: false }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

userSchema.set('deletePass', {
    transform: (document, returnedObject) => {
        delete returnedObject.password;
    }
})

export const UserModel = mongoose.model('User', userSchema);