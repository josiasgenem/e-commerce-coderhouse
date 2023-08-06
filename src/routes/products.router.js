import * as controller from '../controllers/products.controller.js'

import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/', isAuthenticated, controller.getAll)

router.get('/:pid', isAuthenticated, controller.getById)

router.post('/', isAuthenticated, isAdmin, controller.create)

router.put('/:pid', isAuthenticated, isAdmin, controller.update)

router.delete('/:pid', isAuthenticated, isAdmin, controller.remove)

export default router;