import session from "express-session";
import MongoStore from "connect-mongo";
import { MONGO_DB_URI, MONGO_PASSWORD, MONGO_USER } from "../config/environment.js";


export const mongoStoreSession = session({
    secret: 'Coderhouse',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DB_URI}`,
        crypto: 'Coderhouse',
        ttl: 1 * 24 * 60 * 60,
        touchAfter: 24 * 3600
    })
})