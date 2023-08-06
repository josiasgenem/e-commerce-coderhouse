import * as controller from '../controllers/views.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/auth.middleware.js';

import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.redirect('/login');
})

router.get('/register', isNotAuthenticated, controller.register);

router.get('/login', isNotAuthenticated, controller.login);

router.get('/profile', isAuthenticated, controller.profile);

export default router;