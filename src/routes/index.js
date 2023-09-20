import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import usersRouter from './users.router.js';
import ticketRouter from './ticket.router.js';
// import viewsRouter from './views.router.js';

import { Router } from 'express';
const router = Router();

const homeRouter = router.get('/', (req, res) => {
    res.redirect('/users/login');
})

export {
    homeRouter,
    // viewsRouter,
    productsRouter,
    cartsRouter,
    ticketRouter,
    usersRouter
}