import mongoose, { Schema, SchemaType } from "mongoose";

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user'},
    cart: { type: Schema.ObjectId, unique: true, auto: true },
    isThirdAuth: { type: Boolean, default: false, select: false },
    refreshTokens: { type: [String], default: [] }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        document.id = document._id;
        delete document._id;
        delete document.__v;
        return document;
    }
})

userSchema.methods.toSecuredObj = function(...othersFieldsToDelete) {
    const returnedObj = { ...this }._doc;
    
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.password;
    delete returnedObj.refreshTokens;
    delete returnedObj.isThirdAuth;

    for (const field of othersFieldsToDelete) {
        delete returnedObj[field];
    }

    return returnedObj;
}
// ('toSecuredJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id;
//         delete returnedObject._id;
//         delete returnedObject.__v;
//         delete returnedObject.password;
//         delete returnedObject.refreshTokens;
//         delete returnedObject.isThirdAuth;
//     }
// })

export const UserModel = mongoose.model('User', userSchema);