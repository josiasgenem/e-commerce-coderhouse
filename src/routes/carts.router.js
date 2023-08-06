import * as cartsController from '../controllers/carts.controller.js';

import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/', isAuthenticated, cartsController.getAll);

router.get('/:cid', isAuthenticated, cartsController.getById);

router.post('/', isAuthenticated, cartsController.create);

router.post('/:cid/products/:pid', isAuthenticated, cartsController.addProduct);

router.put('/:cid', isAuthenticated, cartsController.updateAllProducts);

router.put('/:cid/products/:pid', isAuthenticated, cartsController.updateProductQty);

router.delete('/:cid/products/:pid', isAuthenticated, cartsController.removeProduct);

router.delete('/:cid', isAuthenticated, cartsController.removeAllProducts);

export default router;