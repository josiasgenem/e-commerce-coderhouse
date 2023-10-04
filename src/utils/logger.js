import winston from "winston";
import 'winston-mongodb';
import { MONGO_DB_URI, MONGO_PASSWORD, MONGO_USER, isProdEnvironment } from "../config/environment.js";

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
        debug: 'italic bold white',
        http: 'bold cyan',
        info: 'italic green',
        warning: 'yellow',
        error: 'red',
        fatal: 'bold red'
    }
}
const formatter = winston.format.combine(
    winston.format.label({label: 'LOGGER'}),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.splat(),
    winston.format.printf((info) => {
        const { label, timestamp, level, message, ...meta } = info;

        return `[${label}] ${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? '\n' + 'meta: ' + JSON.stringify(meta, null, 3) : ''
        }`;
    }),
    winston.format.colorize({all: true}),
    // winston.format.prettyPrint()
    
)

const transports = () => {
    if (isProdEnvironment) return [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({
            filename: 'src/persistence/logs/errors.log',
            level: 'error'
        }),
        new winston.transports.MongoDB({
            db: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DB_URI}`,
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true
            },
            collection: 'logs',
            level: 'error',
            decolorize: true
        }),
    ];
    
    return [
        new winston.transports.Console({ level: 'debug' }),
    ]
};

winston.addColors(customLevels.colors)

export const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: formatter,
    transports: transports()
})