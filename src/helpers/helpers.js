import jwt from 'jsonwebtoken';
import * as config from '../config/environment.js';
import { logger } from '../utils/logger.js';

function getStatus(statusCode) {
    if (isNaN(statusCode)) return;

    let successRegEx = /^2\d\d/g,
        errorRegEx = /^(4|5)\d\d/g;
    
    if (successRegEx.test(statusCode)) return 'success';
    if (errorRegEx.test(statusCode)) return 'error';
    return;
}

export function formatResponse(statusCode, paginateObj, remainingQueries, baseUrl) {
    const { 
        docs,
        limit,
        totalPages,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage
        } = paginateObj;
    
    let queriesArray = [];
    for (const key in remainingQueries) {
        if (Object.hasOwnProperty.call(remainingQueries, key)) {
            if ( remainingQueries[key] && key !== 'limit' && key !== 'page' ) {
                queriesArray.push(`&${key}=${remainingQueries[key]}`)
            }
        }
    }

    const prevLink = `${baseUrl}?limit=${limit}&page=${prevPage}${queriesArray.length > 0 ? queriesArray.join('') : ''}`;
    const nextLink = `${baseUrl}?limit=${limit}&page=${nextPage}${queriesArray.length > 0 ? queriesArray.join('') : ''}`;

    return {
        status: getStatus(statusCode),
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? prevLink : null,
        nextLink: hasNextPage ? nextLink : null
    }
}

export const getCookieByName = (reqCookies, cookieName) => {
    if(!reqCookies) return false;

    if(Array.isArray(reqCookies)) {
        return reqCookies.split(';').map(pair => {
            const [key, value] = pair.split('=');
            if(key === cookieName) return value;
        })[0];
    }
    
    if(typeof reqCookies === 'object') {
        return {...reqCookies}[cookieName];
    }

    return null;
}

export const checkCartIdCookie = (req, res) => {
    try {
        let cartId = getCookieByName(req.cookies, 'coderhouse-ecommerce-cart-id');
        if (!cartId || cartId !== req.user.cartId) {
            // Si un usuario isAuth, tiene que estar cargado en req.user.
            cartId = req.user.cartId;
            res.cookie('coderhouse-ecommerce-cart-id', cartId, {
                httpOnly: false,
                secure: true,
                sameSite: 'Lax',
                path: '/'
            })
        }
        return cartId;
    } catch (err) {
        logger.warn("Unexpected error: Current User should have a Cart ID, but it haven't");
        logger.error('---> handleCartIdCookie error.', err);
        return null;
    }
}

export const getAccessToken = (req) => {
    if (!req.cookies && !req.signedCookies) return null;
    let accessToken;
    if (req.cookies) {
        accessToken = getCookieByName(req.cookies, 'coderhouse-ecommerce-refresh-token');
    }
    if (!accessToken && req.signedCookies) {
        accessToken = getCookieByName(req.signedCookies, 'coderhouse-ecommerce-access-token');
    }
    logger.info(`---> getAccessToken called from: ${req.method} ${req.originalUrl}`,{accessToken});
    return accessToken || null;
}

export const getRefreshToken = (req) => {
    if (!req.cookies && !req.signedCookies) return null;
    let refreshToken;
    if (req.cookies) {
        refreshToken = getCookieByName(req.cookies, 'coderhouse-ecommerce-refresh-token');
    }
    if (!refreshToken && req.signedCookies) {
        refreshToken = getCookieByName(req.signedCookies, 'coderhouse-ecommerce-refresh-token');
    }
    logger.info(`---> getRefreshToken called from: ${req.method} ${req.originalUrl}`, {refreshToken});

    return refreshToken || null;
}

//! Change audience to a environment constant
export const generateAccessToken = (payload) => {
    try {
        const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.ACCESS_TOKEN_EXPIRATION
        })
        
        if (!accessToken) return false;
        
        return accessToken;
    } catch (err) {
        logger.error('---> generateAccessToken', err);
    }
}

//! Change audience to a environment constant
export const generateRefreshToken = (payload) => {
    try {
        const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.REFRESH_TOKEN_EXPIRATION
        })
        
        if (!refreshToken) return false;
        
        return refreshToken;
    } catch (err) {
        logger.error('---> generateRefreshToken', err);
    }
}

//! Change audience to a environment constant
export const generateResetPassToken = (payload) => {
    try {
        const token = jwt.sign(payload, config.RESET_PASS_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.RESET_PASS_TOKEN_EXPIRATION
        })
        
        if (!token) return false;
        
        return token;
    } catch (err) {
        logger.error('---> generateResetPassToken', err);
    }
}

//! Change audience to a environment constant
export const verifyAccessToken = (accessToken) => {
    try {
        const payload = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.ACCESS_TOKEN_EXPIRATION
        });
        
        delete payload.iat;
        delete payload.exp;
        delete payload.aud;
        delete payload.iss;
        return payload;
        
    } catch (err) {
        if (err.name === 'TokenExpiredError'){
            logger.warn('---> verifyAccessToken TokenExpiredError');
            return {
                error: err.name,
                ...jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, {
                    ignoreExpiration: true,
                    complete: false
                })
            }
        }
        logger.error('---> verifyAccessToken error', err);
        return err.name;
    }
}

//! Change audience to a environment constant
export const verifyRefreshToken = (refreshToken) => {
    try {
        const payload = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.REFRESH_TOKEN_EXPIRATION
        });
        
        delete payload.iat;
        delete payload.exp;
        delete payload.aud;
        delete payload.iss;
        
        return payload;
    } catch (err) {
        logger.error('---> verifyRefreshToken error', err);
        if (err.name === 'TokenExpiredError'){
            return {
                error: err.name,
                ...jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, {
                    ignoreExpiration: true,
                    complete: false
                })
            }
        }
        return err.name;
    }
}

//! Change audience to a environment constant
export const verifyResetPassToken = (token) => {
    try {
        const payload = jwt.verify(token, config.RESET_PASS_TOKEN_SECRET, {
            issuer: 'https://coderhouse.com.ar',
            audience: `${config.DOMAIN}`,
            expiresIn: config.RESET_PASS_TOKEN_EXPIRATION
        });
        
        delete payload.iat;
        delete payload.exp;
        delete payload.aud;
        delete payload.iss;
        
        return payload;
    } catch (err) {
        logger.error('---> verifyResetPassToken error', err);
        if (err.name === 'TokenExpiredError'){
            return {
                error: err.name,
                ...jwt.verify(token, config.RESET_PASS_TOKEN_SECRET, {
                    ignoreExpiration: true,
                    complete: false
                })
            }
        }
        return err.name;
    }
}

export const sendAccessRefreshTokens = (res, status, accessToken, refreshToken, redirect = null, message = null) => {
    const refreshCookieOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: 'Lax',
            path: '/users/refresh'
        }
    const accessCookieOptions = { ...refreshCookieOptions };
    accessCookieOptions.path = '/';
    
    if (!refreshToken) refreshCookieOptions.maxAge = 0;
    if (!accessToken) accessCookieOptions.maxAge = 0;
    
    logger.http('REDIRECT: FROM TOKENS SENDER', {redirect});
    return res
            // .status(status)
            .cookie('coderhouse-ecommerce-refresh-token', refreshToken, refreshCookieOptions)
            .cookie('coderhouse-ecommerce-access-token', accessToken, accessCookieOptions)
            .redirect(redirect)
}