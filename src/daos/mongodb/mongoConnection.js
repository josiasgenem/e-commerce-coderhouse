import mongoose from "mongoose";

const mongoDB = process.env.MONGO_DB
const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
export const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoDB}`

try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected!');
} catch (err) {
    console.log(err);
}