import express from "express";
import bodyParser from "body-parser";
import "./config/dotenv.js";
import './daos/mongodb/mongoConnection.js';
import {productsRouter, cartsRouter} from './routes/index.js';

// Presets
const port = (process.env.STATUS === 'production' ?
                process.env.PROD_PORT : 
                process.env.DEV_PORT) || 8080;

const app = express();

// Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})