import * as controller from '../controllers/users.controller.js';
import { Router } from 'express';
import { isAuth, isNotAuth } from '../middlewares/auth.middlewares.js';
const router = Router();

router.get('/register', isNotAuth, controller.viewRegister);

router.post('/register', isNotAuth, controller.register);

router.get('/login', isNotAuth, controller.viewLogin);

router.post('/login', isNotAuth, controller.login);

router.get('/refresh',  controller.refreshToken);

router.delete('/refresh', isAuth, controller.logout);

router.get('/github', isNotAuth, controller.authGitHub);

router.get('/github/callback', controller.authGitHubCallback, (req, res) => res.redirect('/profile'));

router.get('/google', isNotAuth, controller.authGoogle);

router.get('/google/callback', controller.authGoogleCallback, (req, res) => res.redirect('/profile'));

router.get('/profile', isAuth, controller.viewProfile);

router.get('/current', isAuth, controller.current);


export default router;