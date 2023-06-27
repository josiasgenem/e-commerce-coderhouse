import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import {productsRouter, cartsRouter} from './routes/index.js';

const port = (process.env.STATUS === 'production' ?
                process.env.PROD_PORT : 
                process.env.DEV_PORT) || 8080;

const app = express();

// Settings
app.use(bodyParser.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})