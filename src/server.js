import express from "express";
import "./config/dotenv.js";
import { engine } from "express-handlebars";
import path from 'path';
import fileDirName from './utils/es6-path.js';
import { homeRouter, productsRouter, cartsRouter, usersRouter } from './routes/index.js';
import { mongoStoreSession } from "./middlewares/sessions.middlewares.js";
import passport from "passport";
import './config/passport.js';
import { COOKIES_SECRET, PORT } from "./config/environment.js";
import cookieParser from "cookie-parser";
import session from "express-session";

/* -------------------------------------------------------------------------- */
/*                                Environment                                 */
/* -------------------------------------------------------------------------- */
export const { __dirname } = fileDirName(import.meta)

/* -------------------------------------------------------------------------- */
/*                              Iniitializations                              */
/* -------------------------------------------------------------------------- */
const app = express();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

/* -------------------------------------------------------------------------- */
/*                                 Middlewares                                */
/* -------------------------------------------------------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: COOKIES_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser(COOKIES_SECRET));
app.use(express.static(path.join(__dirname, '/public')));
app.use(mongoStoreSession)
app.use(passport.initialize());
app.use(passport.session());

 /* -------------------------------------------------------------------------- */
 /*                                    Views                                   */
 /* -------------------------------------------------------------------------- */
app.engine('.hbs', engine({ extname: '.hbs', partialsDir: path.join(__dirname,'/views/partials') }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
app.use('/', homeRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/users', usersRouter);