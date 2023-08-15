import * as service from '../services/users.service.js';
import passport from 'passport';

export const viewRegister = async (req, res) => {
    res.render('register'); 
}

export const register = passport.authenticate('register', { 
    successRedirect: '/users/login',
    failureRedirect: '/users/register'
})

export const viewLogin = async (req, res) => {
    res.render('login'); 
}

export const login = passport.authenticate('login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login'
})

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

export const viewProfile = async (req, res) => {
    res.render('profile', { user: req.user })
}

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/users/login');
    });
}