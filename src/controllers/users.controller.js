import * as service from '../services/users.service.js';
import bcrypt from 'bcrypt';
import MailingService from '../services/mailing.service.js';
const mailingService = new MailingService();
import passport from 'passport';
import { ServerError } from '../config/errors.js';
import { verifyResetPassToken } from '../helpers/helpers.js';
import { usersDao } from '../persistence/factory.js';
import { logger } from '../utils/logger.js';

export const viewRegister = async (req, res, next) => {
    res.render('register'); 
}

export const register = passport.authenticate('register', { 
    successRedirect: '/users/login',
    failureRedirect: '/users/register'
})

export const viewLogin = async (req, res, next) => {
    res.render('login'); 
}

export const login = service.jwtLogin;

export const refreshToken = service.refreshToken;

// export const login = passport.authenticate('sessionLogin', {
//     successRedirect: '/users/profile',
//     failureRedirect: '/users/login'
// })

export const authGitHub = passport.authenticate('github', { scope: ['user:email'] })

export const authGitHubCallback = passport.authenticate('github', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login'
})

export const authGoogle = passport.authenticate('google', { scope: ['email', 'profile'] })

export const authGoogleCallback = passport.authenticate('google', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login'
})

export const viewProfile = async (req, res, next) => {
    res.render('profile', { user: req.user })
}

export const current = async (req, res, next) => {
    const { email } = req.user;
    try {
        const user = await service.current(email);
        if (!user) res.status(500).json({ message: "Something went wrong!" });
        
        res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
}

export const logout = service.jwtLogout;


export const viewRequestResetPassword = async (req, res, next) => {
    res.status(200).render('request-reset-pass');
}

export const requestResetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const service = await mailingService.sendResetToken(email);
        if (!service.success) throw new ServerError(service.message)
        res.status(200).json({status: 'success', message: service.message})
    } catch (err) {
        return next(err);
    }
}

export const viewResetPassword = async (req, res, next) => {
    const { token } = req.params;
    try {

        const payload = verifyResetPassToken(token);
        if (typeof payload !== 'object') return res.status(400).json({
            status: 'error',
            message: 'Bad Request: Data you sent is wrong!',
            redirect: {
                path: '/users/login',
                method: 'get'
            }
        })
        if (payload.error && payload.error === 'TokenExpiredError') {
            return res.status(400).json({
                status: 'error',
                message: 'Bad Request: Your link expired, request your password reset again please.'
            })
        }
        
        return res.status(200).render('reset-password');

    } catch (err) {
        return next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const payload = verifyResetPassToken(token);
        if (typeof payload !== 'object') return res.status(400).json({
            status: 'error',
            message: 'Bad Request: Data you sent is wrong!',
            redirect: {
                path: '/users/login',
                method: 'get'
            }
        })
        if (payload.error && payload.error === 'TokenExpiredError') {
            return res.status(400).json({
                status: 'error',
                message: 'Bad Request: Your link expired, request your password reset again please.'
            })
        }

        const user = await usersDao.getByEmail(payload.email, true);
        if (!user) {
            logger.warn(`Someone tried to reset password, but email '${email}' does not exist!`);
            return res.status(400).json({status: 'error', message: `You tried to reset password, but you sent some wrong data.` });
        }
        const match = await bcrypt.compare(password, user.password)
        if (match) return res.status(400).json({status: 'error', message: `Your password must not be equal to the previous password. You must change to a new one.` })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.password = hash;
        const success = await user.save();
        if(!success) throw new ServerError('Usuario no se guardó correctamente al cambiar contraseña');

        res.status(200).json({message: 'Password changed successfully! Please Login!'});
        
    } catch (err) {
        return next(err);
    }
}

// export const logout = (req, res, next) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         res.redirect('/users/login');
//     });
// }