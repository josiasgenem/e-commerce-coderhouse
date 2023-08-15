import * as controller from '../controllers/users.controller.js';
import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/register', isNotAuthenticated, controller.viewRegister);

router.post('/register', isNotAuthenticated, controller.register);

router.get('/login', isNotAuthenticated, controller.viewLogin);

router.post('/login', isNotAuthenticated, controller.login);

router.get('/login-github', isNotAuthenticated, controller.authGitHub);

router.get('/login-github-callback', controller.authGitHubCallback, (req, res) => res.redirect('/profile'));

router.get('/profile', isAuthenticated, controller.viewProfile);

router.get('/logout', isAuthenticated, controller.logout);

export default router;