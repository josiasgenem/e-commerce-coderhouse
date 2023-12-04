import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
<<<<<<< HEAD
import usersRouter from './users.router.js';
import ticketRouter from './ticket.router.js';
import { logger } from '../utils/logger.js';
// import viewsRouter from './views.router.js';

import { Router } from 'express';
const router = Router();

const homeRouter = router
    .get('/', (req, res) => {
        res.redirect('/users/login');
    })
    .get('/test-logger', (req, res) => {
        
        logger.debug('Logging debug');
        logger.http('Logging http');
        logger.info('Logging info');
        logger.warn('Logging warning');
        logger.error('Logging error');
        logger.fatal('Logging fatal');
        
        res.status(200).json({message: 'Logger tester executed'});
    })
=======
import realTimeRouter from './realTime.router.js';
>>>>>>> 3ece0304e4b66010567558f375e091e96d16b35f

export {
    homeRouter,
    // viewsRouter,
    productsRouter,
    cartsRouter,
<<<<<<< HEAD
    ticketRouter,
    usersRouter
=======
    realTimeRouter
>>>>>>> 3ece0304e4b66010567558f375e091e96d16b35f
}