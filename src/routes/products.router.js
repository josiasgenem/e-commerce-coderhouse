import * as controller from '../controllers/products.controller.js'

import { Router } from 'express';
import { isAdmin, isAuth, isPremium } from '../middlewares/auth.middlewares.js';
const router = Router();

router.get('/dashboard', isAuth, controller.viewDashboard)

router.get('/add', isAuth, isPremium, controller.viewAddProduct)

router.get('/update/:pid', isAuth, controller.viewUpdateProduct)

router.post('/', isAuth, isPremium, controller.create)

router.get('/', isAuth, controller.getAll)

router.post('/mockingproducts', isAuth, isAdmin, controller.mock)

router.get('/:pid', isAuth, controller.getById)

router.put('/:pid', isAuth, isPremium, controller.update)

router.delete('/:pid', isAuth, isPremium, controller.remove)

export default router;