import { UserModel } from './models/users.model.js';

export default class UserDaoMongoDB {
    async create({ first_name, last_name, email, password, age, role }) {
        try {
            const userExist = await this.getByEmail(email);
            if(userExist) throw new Error('User already exists!');
            return UserModel.create({first_name, last_name, email, password, age, role});
        } catch (err) {
            throw err;
        }
    }

    async getByEmail(email, returnPass = false ) {
        const selects = [];
        if(returnPass) selects.push('+password');

        try {
            const user = selects.length > 0 ?
                            await UserModel.findOne({ email }, selects) :
                            await UserModel.findOne({ email }).lean();
            if (!user) return false;
            return user;
        } catch (err) {
            throw err;
        }
    }
}