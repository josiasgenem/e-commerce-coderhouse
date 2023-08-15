import UserDaoMongoDB from "../daos/mongodb/users.dao.js";
import bcrypt from 'bcrypt';
const userDao = new UserDaoMongoDB();

const   namesRegEx = /[a-zÀ-ÿ]{2,30}/i,
        emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        passwordRegEx = /(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)/;

export const register = async (req, username, pass, done) => {
    const {first_name, last_name, email, password, age, role} = req.body;
    try {
        if (!namesRegEx.test(first_name)) done(true, {error: 'First name seems to be not written correctly.'});
        if (!namesRegEx.test(last_name)) done(true, {error: 'Last name seems to be not written correctly.'});
        if (!emailRegEx.test(email)) done(true, {error: 'Email seems to be not written correctly.'});
        if (!passwordRegEx.test(password)) done(true, {error: 'Password must contain at least 6 characters, 1 uppercase, 1 lowercase and 1 number.'});
        if ((age && typeof age !== 'number') || age >= 120) done(true, {error: 'Age must be a valid number minor to 120 years'});
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const userExist = await userDao.getByEmail(email);
        if(userExist) return done(null, false);

        const user = await userDao.create({first_name, last_name, email, password: hash, age, role, isThirdAuth: false});
        return done(null, user);
    } catch (err) {
        console.log('---> Register Service:', err);
        return done(true, {error: err.message})
    }
}

export const login = async (req, username, pass, done) => {
    const { email, password } = req.body;
    try {
        if(!emailRegEx.test(email) || !passwordRegEx.test(password)) done(true, { error: 'Email or Password seems to be not written correctly.' });

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            return done(null, {
                first_name: 'Coder',
                last_name: 'House',
                email: 'adminCoder@coder.com',
                role: 'admin'
            })
        }
        const user = await userDao.getByEmail(email, true);
        if (!user) done(null, false, {message: "Email or Password wrong"});
        const match = await bcrypt.compare(password, user.password);
        if (!match) done(null, false, {message: "Email or Password wrong"});

        return done(null, user.toJSON());
    } catch (err) {
        console.log('---> Login Service:', err);
        return done(true, {error: err.message});
    }
}