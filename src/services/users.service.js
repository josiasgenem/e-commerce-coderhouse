import { usersDao } from '../persistence/factory.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { 
    generateAccessToken,
    generateRefreshToken,
    getRefreshToken,
    sendAccessRefreshTokens,
    verifyRefreshToken
} from "../helpers/helpers.js";
import UsersRepository from '../persistence/repository/users/users.repository.js';
const usersRepository = new UsersRepository();

const   namesRegEx = /[a-zÀ-ÿ]{2,30}/i,
        emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        passwordRegEx = /(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)/;

export const register = async (req, username, pass, done) => {
    const {first_name, last_name, email, password, age, role} = req.body;
    try {
        if (!namesRegEx.test(first_name)) done('First name seems to be not written correctly.', false);
        if (!namesRegEx.test(last_name)) done('Last name seems to be not written correctly.', false);
        if (!emailRegEx.test(email)) done('Email seems to be not written correctly.', false);
        if (!passwordRegEx.test(password)) done('Password must contain at least 6 characters, 1 uppercase, 1 lowercase and 1 number.', false);
        if ((age && typeof parseInt(age) !== 'number') || age >= 120) done('Age must be a valid number minor to 120 years', false);
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const userExist = await usersDao.getByEmail(email);
        if(userExist) return done('El usuario ya existe!', false);

        const user = await usersDao.create(usersRepository.formatToDB({
            first_name, last_name, email, password: hash, age: parseInt(age), role, isThirdAuth: false
        }));
        const repositoryUser = usersRepository.formatFromDB(user);

        return done(null, repositoryUser.sanitize());
    } catch (err) {
        console.log('---> Register Service:', err);
        return done(err.message, false);
    }
}

// export const sessionLogin = async (req, username, pass, done) => {
//     const { email, password } = req.body;
//     try {
//         if(!emailRegEx.test(email) || !passwordRegEx.test(password)) done('Email or Password seems to be not written correctly.', false);
        
//         if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//             return done(null, {
//                 first_name: 'Coder',
//                 last_name: 'House',
//                 email: 'adminCoder@coder.com',
//                 role: 'admin'
//             })
//         }
//         const user = await usersDao.getByEmail(email, true);
//         if (!user) done(null, false, {message: "Email or Password wrong"});
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) done(null, false, {message: "Email or Password wrong"});
        
//         return done(null, user.toJSON());
//     } catch (err) {
//         console.log('---> Login Service:', err);
//         return done(err.message, false);
//     }
// }

export const jwtLogin = async (req, res) => {
    
    const { email, password } = req.body;
    try {
        if(!emailRegEx.test(email) || !passwordRegEx.test(password)) return res.status(401).json({message: "Email or Password seems to be not written correctly."});
        let payload,
            accessToken,
            refreshToken;
        
        let user = await usersDao.getByEmail(email, true);

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            if(!user) {
                // Intenta registrar al admin en la DB utilizando la estrategia de register.
                // req.body.first_name = payload.first_name;
                // req.body.last_name = payload.last_name;
                // req.body.email = payload.email;
                // req.body.role = payload.role;
                // req.body.password = password;
                
                req.body = {
                    ...req.body,
                    ...usersRepository.formatToDB({first_name, last_name, email, role, password, isThirdAuth: false})
                }

                passport.authenticate('register', { 
                    successRedirect: '/users/login',
                    failureRedirect: '/users/register'
                })
                
                console.log(user, 'ADMIN USER');
            
                user = await usersDao.getByEmail(email, true);
            }
        }

            if (!user) return res.status(401).json({message: "Email or Password wrong"});
            if (!user.password) return res.status(401).json({message: "You've registered with a Third part service. \n Try to login with Google or Github, and then set a password to enable local login."});
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({message: "Email or Password wrong"});
            
            payload = usersRepository.formatFromDB(user).sanitize();
            // payload = {
            //     first_name: user.first_name,
            //     last_name: user.last_name,
            //     email: user.email,
            //     cartId: user.cart,
            //     role: user.role
            // }
        
        accessToken = generateAccessToken(payload);
        refreshToken = generateRefreshToken(payload);
        
        const updUser = await usersDao.saveRefreshToken(user.email, refreshToken);
        if (!updUser) return res.status(500).json({message: "Something went wrong!"})
        
        return sendAccessRefreshTokens(res, 201, accessToken, refreshToken, '/users/profile');
        
        } catch (err) {
            console.log('---> Login Service:', err);
            return { status: 'error', message: err.message };
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { originalUrl } = req.session?.context;
        const refreshToken = getRefreshToken(req);
        if (!refreshToken) return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong Authentication: No Token received')
        
        const payload = verifyRefreshToken(refreshToken);
        if (typeof payload !== 'object') {
            console.log(req.session, 'REQ.SESSION');
            if (req && req.user && req.user.email) {
                console.log('ENTRÓ ------------------------------------------------------------------------');
                const user = await usersDao.getByEmail(req.user.email)
                user.refreshTokens = [];
                await user.save();
            }
            return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong Authentication: Invalid Token received');
        }
        
        const user = await usersDao.getByEmail(payload.email);
        if (!user.refreshTokens.some(token => token === refreshToken)) {
            user.refreshTokens = [];
            await user.save();
            return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong Authentication: Token Expired');
        }
        
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        if (payload.error || payload.error === 'TokenExpiredError') {
            const newUser = await user.save();
            console.log(newUser);
            return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong Authentication: Invalid Token received');
        }
        
        const newRefreshToken = generateRefreshToken(payload);
        const newAccessToken = generateAccessToken(payload);
        console.log('\x1b[32m------ NUEVOS TOKENS GENERADOS -----\x1b[0m');
        
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        return sendAccessRefreshTokens(res, 201, newAccessToken, newRefreshToken, originalUrl)
        
    } catch (err) {
        console.log('---> Login Service:', err);
        return { status: 'error', message: err.message };
    }
}

export const jwtLogout = async (req, res) => {
    
    //! A veces genera Error: ERR_TOO_MANY_REDIRECTS.

    try {
        const refreshToken = getRefreshToken(req);
        if (!refreshToken) {
            console.log('\x1b[31m-------- QUISO DESLOGEARSE PERO NO MANDÓ REFRESH TOKENS!!!!!!!!!!!! ------------\x1b[31m');
            return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong authentication: No Token received!');
        }
        
        const payload = verifyRefreshToken(refreshToken);
        if (typeof payload !== 'object') return sendAccessRefreshTokens(res, 401, null, null, '/users/login', 'Wrong Authentication: Invalid Token received');

        const user = await usersDao.getByEmail(payload.email);
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();

        return sendAccessRefreshTokens(res, 201, null, null, '/users/login');

    } catch (err) {
        console.log('---> Login Service:', err);
        return { status: 'error', message: err.message };
    }
}

export const registerOrLogin = async (req, accessToken, refreshToken, profile, done) => {
    const email = profile._json.email || profile._json.blog;
    const first_name = profile.given_name || profile._json.name?.split(' ').slice(0,1)[0] || profile.username;
    const last_name = profile.family_name || profile._json.name?.split(' ').slice(1).join(' ');
    
    if (!email) return done(`Debes poner tu email como público en tu cuenta de GitHub!\nDeselecciona la opción: "Keep my email addresses private." en "email settings" de GitHub.`, false)
    
    // THIRD AUTH LOGIN
    const user = await usersDao.getByEmail(email);
    if (user) {
        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        },
        accessToken = generateAccessToken(payload),
        refreshToken = generateRefreshToken(payload);
        
        user.refreshTokens.push(refreshToken);
        const updUser = await user.save();
        if(!updUser) {
            res.status(500).json({message: "Something went wrong!"});
            return done("Something went wrong!", null);
        }
        
        sendAccessRefreshTokens(res, 201, accessToken, refreshToken, '/users/profile')
        
        return done(null, user.toJSON());
    }
    
    // THIRD AUTH REGISTER
    const newUser = await usersDao.create({first_name, last_name, email, isThirdAuth: true})
    return done(null, newUser.toJSON());
}

export const current = async (email) => {
    const user = await usersDao.getByEmail(email, true);
    console.log(user, 'USER FROM CURRENT ENDPOINT');
    const repositoryUser = usersRepository.formatFromDB(user).sanitize();
    console.log(repositoryUser, 'REPOSITORY USER FROM CURRENT ENDPOINT');
    return repositoryUser;
}