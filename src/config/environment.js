if (process.env.DB_SYSTEM === 'MONGODB') import('../daos/mongodb/mongoConnection.js');

export const PORT = (process.env.STATUS === 'production' ?
    process.env.PROD_PORT :
    process.env.DEV_PORT) || 8080;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;
export const COOKIES_SECRET = process.env.COOKIES_SECRET;