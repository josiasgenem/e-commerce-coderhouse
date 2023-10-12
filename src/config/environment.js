export const isProdEnvironment = () => process.env.STATUS === 'production';

export const PORT = isProdEnvironment() ? process.env.PROD_PORT :
    process.env.DEV_PORT || 8080;


/* ----------------------------------- DBs ---------------------------------- */
export const DB_ENGINE = process.env.DB_ENGINE;
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const MONGO_USER = process.env.MONGO_USER;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

/* ------------------------------ AUTH SERVICES ----------------------------- */
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/* --------------------------------- TOKENS --------------------------------- */
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;
export const RESET_PASS_TOKEN_SECRET = process.env.RESET_PASS_TOKEN_SECRET;
export const RESET_PASS_TOKEN_EXPIRATION = process.env.RESET_PASS_TOKEN_EXPIRATION;
export const COOKIES_SECRET = process.env.COOKIES_SECRET;

/* ------------------------------ SMTP SERVICE ----------------------------- */
export const SMTP_SERVICE= process.env.SMTP_SERVICE;
export const SMTP_EMAIL= process.env.SMTP_EMAIL;
export const SMTP_PASSWORD= process.env.SMTP_PASSWORD;