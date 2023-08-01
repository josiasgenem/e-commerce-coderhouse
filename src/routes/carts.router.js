import * as cartsController from '../controllers/carts.controller.js';

import { Router } from 'express';
const router = Router();

router.get('/', cartsController.getAll);

router.get('/:cid', cartsController.getById);

router.post('/', cartsController.create);

router.post('/:cid/products/:pid', cartsController.addProduct);

router.put('/:cid', cartsController.updateAllProducts);

router.put('/:cid/products/:pid', cartsController.updateProductQty);

router.delete('/:cid/products/:pid', cartsController.removeProduct);

router.delete('/:cid', cartsController.removeAllProducts);

export default router;