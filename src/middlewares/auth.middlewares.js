import { checkCartIdCookie, getAccessToken, getRefreshToken, sendAccessRefreshTokens, verifyAccessToken } from "../helpers/helpers.js"
import { logger } from "../utils/logger.js";

// export const isAuth = (req, res, next) => {
//     if (!req.isAuthenticated()) return res.redirect('/users/login');
//     return next();
// }

// export const isNotAuth = (req, res, next) => {
//     if(req.isAuthenticated()) return res.redirect('/users/profile');
//     return next();
// }

// export const isAdmin = (req, res, next) => {
//     if (req.user.role === 'admin') return next();
//     res.json({
//         status: 'error',
//         error: 'Forbidden! Only Admin members!'
//     });
// }

export const isAuth = (req, res, next) => {
    const accessToken = getAccessToken(req);
    if (!accessToken) return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong authentication: No token received')
    const payload = verifyAccessToken(accessToken);
    if (typeof payload !== 'object') return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong authentication: Invalid Token received')
    if (payload.error && payload.error === 'TokenExpiredError') {
        // return res.status(301).json({
        //     redirect: {
        //         path: '/users/refresh',
        //         method: 'get'
        //     },
        //     originalUrl: req.originalUrl
        // })
        if (payload.email) {
            req.user = {
                email: payload.email
            }
        }
        req.session.context = {
            originalUrl: req.originalUrl
        }
        return res.redirect('/users/refresh');
    }

    req.user = payload;
    checkCartIdCookie(req, res);

    return next();
}

/** 
 * @description This middleware function checks if the user is Not Authenticated.
 * It should never receive any Access or Refresh Token.
 * Anyway, if it receives any token, it can handle it to avoid unexpected client logouts.
 * @returns 
 * If it receives a Refresh Token and  it will return next() call.
 * If User is not authenticated it will return next() call.
*/
export const isNotAuth = (req, res, next) => {
    const accessToken = getAccessToken(req);
    const refreshToken = getRefreshToken(req);
    if (accessToken || refreshToken) {
        let payload;
        if (refreshToken && req.originalUrl.includes('/users/refresh')) return next();
        if (accessToken) payload = verifyAccessToken(accessToken);

        if (typeof payload !== 'object') {
            logger.warn('Se quizo ingresar un token inválido en el middleware isNotAuth');
            sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong authentication: Invalid Token when trying to access to a non protected path.')
            return next();
        }
        if (payload.error && payload.error === 'TokenExpiredError') {
            // return res.status(301).json({
            //     redirect: {
            //         path: '/users/refresh',
            //         method: 'get'
            //     },
            //     originalUrl: req.originalUrl
            // })
            req.session.context = {
                originalUrl: req.originalUrl
            }
            return res.redirect('/users/refresh');
        }
        if (payload && !payload.error) {
            req.session.context = {
                message: "You're logged in, you have not to access to this path."
            }
            return res.redirect('/users/profile');
            // res.status(301).json({ redirect: '/users/profile', message: "You're logged in, you have not to access to this path." })
        }
    }

    if (!accessToken && !refreshToken) {
        return next();
    }
}

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: "You're Not Authorized!" })
    return next();
}