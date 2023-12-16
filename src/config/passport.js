import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as userService from "../services/users.service.js";
import UserDaoMongoDB from "../persistence/daos/mongodb/users.dao.js";
import { DOMAIN } from "./environment.js";
const userDao = new UserDaoMongoDB();


const localStrategyOptions = {
    usernameField: 'email',
    passReqToCallback: true
}

const githubStrategyOptions = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${DOMAIN}/users/github/callback`,
    passReqToCallback: true
}

const googleStrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${DOMAIN}/users/google/callback`,
    passReqToCallback: true
}


const registerStrategy = new LocalStrategy( localStrategyOptions, userService.register);
// const loginStrategy = new LocalStrategy( localStrategyOptions, userService.sessionLogin);
const githubStrategy = new GithubStrategy( githubStrategyOptions, userService.registerOrLogin )
const googleStrategy = new GoogleStrategy( googleStrategyOptions, userService.registerOrLogin )


passport.use('register', registerStrategy);
// passport.use('sessionLogin', loginStrategy);
passport.use('github', githubStrategy);
passport.use('google', googleStrategy);


passport.serializeUser((user, done) => {
    if (!user.id) return done('User ID not found!', false);
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userDao.getById(id);
    return done(null, user.toJSON());
});