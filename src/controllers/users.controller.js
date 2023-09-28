import * as service from '../services/users.service.js';
import passport from 'passport';

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

// export const logout = (req, res, next) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         res.redirect('/users/login');
//     });
// }