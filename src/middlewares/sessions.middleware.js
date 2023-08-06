import session from "express-session";
import MongoStore from "connect-mongo";
import { mongoUrl } from "../daos/mongodb/mongoConnection.js";


export const mongoStoreSession = session({
    secret: 'Coderhouse',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl,
        crypto: 'Coderhouse',
        ttl: 1 * 24 * 60 * 60,
        touchAfter: 24 * 3600
    })
})