import UserDaoMongoDB from "../daos/mongodb/users.dao.js";
import bcrypt from 'bcrypt';
const userDao = new UserDaoMongoDB();

export const register = async ({first_name, last_name, email, password, age, role}) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await userDao.create({first_name, last_name, email, password: hash, age, role});
        return user;    
    } catch (err) {
        throw err;
    }
}

export const login = async (email, password) => {
    try {
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            return {
                first_name: 'Coder',
                last_name: 'House',
                email: 'adminCoder@coder.com',
                role: 'admin'
            }
        }
        const user = await userDao.getByEmail(email, true);
        if (!user) throw new Error('Email or Password wrong');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Email or Password wrong');

        return user.toJSON();
    } catch (err) {
        throw err;
    }
}