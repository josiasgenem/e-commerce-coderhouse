import * as controller from '../controllers/products.controller.js'

import { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/auth.middlewares.js';
const router = Router();

router.get('/', isAuth, controller.getAll)

router.get('/:pid', isAuth, controller.getById)

router.post('/', isAuth, isAdmin, controller.create)

router.put('/:pid', isAuth, isAdmin, controller.update)

router.delete('/:pid', isAuth, isAdmin, controller.remove)

export default router;