import express from "express";
import "./config/dotenv.js";
import { engine } from "express-handlebars";
import path from 'path';
import fileDirName from './utils/es6-path.js';
import { viewsRouter, productsRouter, cartsRouter, usersRouter } from './routes/index.js';
import { mongoStoreSession } from "./middlewares/sessions.middleware.js";

// Presets
if (process.env.DB_SYSTEM === 'MONGODB') import('./daos/mongodb/mongoConnection.js');
const port = (process.env.STATUS === 'production' ?
    process.env.PROD_PORT :
    process.env.DEV_PORT) || 8080;
const { __dirname } = fileDirName(import.meta)

// Iniitializations
const app = express();
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(mongoStoreSession)

//  Views
app.engine('.hbs', engine({ extname: '.hbs', partialsDir: path.join(__dirname,'/views/partials') }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

// Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/users', usersRouter);