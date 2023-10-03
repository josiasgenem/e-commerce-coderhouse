import mongoose from "mongoose";
import { MONGO_DB_URI, MONGO_PASSWORD, MONGO_USER } from "../../../config/environment.js";
import { logger } from "../../../utils/logger.js";

export const initMongoDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DB_URI}`);
        logger.info('MongoDB connected!');
        return mongoose;
    } catch (err) {
        console.log(err, 'Mongo Init Connection Error!');
    }
}