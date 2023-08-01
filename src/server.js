import express from "express";
import "./config/dotenv.js";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import path from 'path';
import fileDirName from './utils/es6-path.js';
import {productsRouter, cartsRouter} from './routes/index.js';

// Presets
if (process.env.DB_SYSTEM === 'MONGODB') import('./daos/mongodb/mongoConnection.js');
const port = (process.env.STATUS === 'production' ?
                process.env.PROD_PORT : 
                process.env.DEV_PORT) || 8080;
const { __dirname } = fileDirName(import.meta)

// Server
const app = express();
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

// Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

//  Views
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);