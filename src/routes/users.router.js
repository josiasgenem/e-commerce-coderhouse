import * as controller from '../controllers/users.controller.js';

import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.get('/logout', isAuthenticated, controller.logout);

export default router;