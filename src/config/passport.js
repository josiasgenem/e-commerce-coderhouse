import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import * as userService from "../services/users.service.js";
import UserDaoMongoDB from "../daos/mongodb/users.dao.js";
const userDao = new UserDaoMongoDB();

const localStrategyOptions = {
    usernameField: 'email',
    passReqToCallback: true
}

const githubStrategyOptions = {
    clientID: "Iv1.0da322f34b067a05",
    clientSecret: "8b243fbe995046cbf17a3d71ea2a2404284636b9",
    callbackURL: "http://localhost:8080/users/profile"
}

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    const email = profile._json.email || profile._json.blog;
    const first_name = profile._json.name.split(' ').slice(0,1)[0];
    const last_name = profile._json.name.split(' ').slice(1).join(' ');
    
    const user = await userDao.getByEmail(email);
    if (user) return done(null, user);

    const newUser = await userDao.create({first_name, last_name, email, isThirdAuth: true})
    return done(null, newUser);
}

const registerStrategy = new LocalStrategy( localStrategyOptions, userService.register);
const loginStrategy = new LocalStrategy( localStrategyOptions, userService.login);
const githubStrategy = new GithubStrategy( githubStrategyOptions, registerOrLogin )


passport.use('register', registerStrategy);
passport.use('login', loginStrategy);
passport.use('github', githubStrategy)

passport.serializeUser((user, done) => {
    if (!user.id) return done(true, {error: 'User ID not found!'});
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userDao.getById(id);
    return done(null, user);
})