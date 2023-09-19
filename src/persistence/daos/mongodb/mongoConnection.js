import mongoose from "mongoose";
import { MONGO_DB_URI, MONGO_PASSWORD, MONGO_USER } from "../../../config/environment.js";

export const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DB_URI}`;

export const initMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected!');
    } catch (err) {
        console.log(err);
    }
}