import winston from "winston";
import 'winston-mongodb';
import { MONGO_DB_URI, MONGO_PASSWORD, MONGO_USER } from "../config/environment.js";

const customLevels = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        debug: 'white',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'red',
        fatal: 'red'
    }
}

const devLogger = {};
const prodLogger = {};

export const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.MongoDB({
            db: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DB_URI}`,
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,

            },
            collection: 'logs',
            level: 'info',
            decolorize: true
        }),
        new winston.transports.File({
            filename: '../persistence/errors/errors.log',
            level: 'error'
        })
    ]
})