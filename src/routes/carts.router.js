import * as cartsController from '../controllers/carts.controller.js';

import { Router } from 'express';
const router = Router();

router.get('/', cartsController.getAll);

router.get('/:cid', cartsController.getById);

router.post('/', cartsController.create);

router.post('/:cid/product/:pid', cartsController.addProduct);

router.delete('/:cid', cartsController.remove);

export default router;