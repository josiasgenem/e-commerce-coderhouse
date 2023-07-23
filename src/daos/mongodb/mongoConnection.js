import mongoose from "mongoose";

const mongoDB = process.env.MONGO_DB
const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD

try {
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@${mongoDB}`);
    console.log('MongoDB connected!');
} catch (err) {
    console.log(err);
}