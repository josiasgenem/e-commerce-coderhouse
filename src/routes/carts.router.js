import * as cartsController from '../controllers/carts.controller.js';

import { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/auth.middlewares.js';
const router = Router();

// router.get('/', isAuth, cartsController.getAll);

// Obtiene el carrito del suuario logueado actualmente.
router.get('/', isAuth, cartsController.getCurrentUserCart);

// Si es Admin obtiene el carrito que desee, sino obtiene el propio del usuario logueado.
router.get('/:cid', isAuth, cartsController.getById);

// router.post('/', isAuth, cartsController.create);

router.post('/:cid/products/:pid', isAuth, cartsController.addOneProduct);

router.put('/:cid', isAuth, isAdmin, cartsController.updateAllProducts);

router.put('/:cid/products/:pid', isAuth, cartsController.updateProductQty);

router.delete('/:cid/products/:pid', isAuth, cartsController.removeOneProduct);

router.post('/:cid/purchase', isAuth, cartsController.purchase)

router.delete('/:cid', isAuth, cartsController.removeAllProducts);

export default router;