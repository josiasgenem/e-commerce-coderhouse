import UserDaoMongoDB from "../daos/mongodb/users.dao.js";
import bcrypt from 'bcrypt';
const userDao = new UserDaoMongoDB();

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

        const userExist = await userDao.getByEmail(email);
        if(userExist) return done('El usuario ya existe!', false);

        const user = await userDao.create({first_name, last_name, email, password: hash, age: parseInt(age), role, isThirdAuth: false});

        return done(null, user.toJSON());
    } catch (err) {
        console.log('---> Register Service:', err);
        return done(err.message, false);
    }
}

export const login = async (req, username, pass, done) => {
    const { email, password } = req.body;
    try {
        if(!emailRegEx.test(email) || !passwordRegEx.test(password)) done('Email or Password seems to be not written correctly.', false);
        
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
        return done(err.message, false);
    }
}