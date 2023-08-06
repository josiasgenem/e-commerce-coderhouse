import * as service from '../services/users.service.js';

const   namesRegEx = /[a-zÀ-ÿ]{2,30}/i,
        emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        passwordRegEx = /(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)/;

export const register = async ( req, res ) => {
    const { first_name, last_name, email, password, age, role } = req.body;

    try {
        if (!namesRegEx.test(first_name)) throw new Error('First name seems to be not written correctly.');
        if (!namesRegEx.test(last_name)) throw new Error('Last name seems to be not written correctly.');
        if (!emailRegEx.test(email)) throw new Error('Email seems to be not written correctly.');
        if (!passwordRegEx.test(password)) throw new Error('Password must contain at least 6 characters, 1 uppercase, 1 lowercase and 1 number.');
        if (typeof age !== 'number' && age >= 120) throw new Error('Age must be a valid number minor to 120 years');

        const user = await service.register({ first_name, last_name, email, password, age: parseInt(age), role });
        if(!user) throw new Error('Something went wrong!');

        res.status(200).redirect('login');
    } catch (err) {
        console.log(err);
        res.json({
            status: 'error',
            error: err.message
        })
    }
}

export const login = async ( req, res ) => {
    const { email, password } = req.body;
    
    try {
        if(!emailRegEx.test(email) || !passwordRegEx.test(password)) throw new Error('Email or Password seems to be not written correctly.');
        
        const user = await service.login(email, password);
        req.session.user = user;

        res.status(200).redirect('/profile');
        
    } catch (err) {
        console.log(err);
        res.json({
            status: 'error',
            error: err.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/profile').json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}