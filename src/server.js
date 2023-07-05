import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from 'path';
import fileDirName from "./utils/es6-path.js";

// Presets
const port = (process.env.STATUS === 'production' ?
process.env.PROD_PORT : 
process.env.DEV_PORT) || 8080;
const { __dirname } = fileDirName(import.meta);

// Server
import { io } from "./sockets/socketServer.js";
const app = express();
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
export const socketServer = io(httpServer);

// Settings
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join( __dirname, '/public' )));

// Views
import exphbs from "express-handlebars";
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

// Routes
import { productsRouter, cartsRouter, realTimeRouter } from './routes/index.js';
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', realTimeRouter)

// Socket IO
// import { Server } from 'socket.io';

// const socketServer = new Server(httpServer);

// socketServer.on('connection', (socket) => {
    //     console.log("Nuevo cliente conectado!", socket.id);
    
    //     socket.on('saludo', (message) => {
//         console.log(message);
//         socket.emit('saludoVuelta', "Hola desde Backend");
//     })
// })