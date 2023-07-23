import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.STATUS) dotenv.config({path: './coderhouse.env'})