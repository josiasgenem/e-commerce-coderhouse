import { UserModel } from './models/users.model.js';

export default class UserDaoMongoDB {
    async create({ first_name, last_name, email, password, age, role, isThirdAuth }) {
        try {
            return UserModel.create({first_name, last_name, email, password, age, role, isThirdAuth});
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
                            await UserModel.findOne({ email });
            if (!user) return false;
            return user;
        } catch (err) {
            throw err;                                                               
        }
    }
    
    async getById(id, returnPass = false) {
        const selects = [];
        if(returnPass) selects.push('+password');
    
        try {
            const user = selects.length > 0 ?
                            await UserModel.findById(id, selects) :
                            await UserModel.findById(id);
            if (!user) return false;
            return user;
        } catch (err) {
            throw err;
        }
    }

    async updateByEmail(email, toUpdateObj) {
        try {
            const user = await UserModel.findOneAndUpdate({email}, toUpdateObj, {new: true})
            if(!user) return false;
            return user;
        } catch (err) {
            throw err
        }
    }

    async saveRefreshToken(email, refreshToken) {
        try {
            const user = await UserModel.findOne({email});
            const existToken = user.refreshTokens.filter(token => refreshToken === token)
            if(existToken) return false;
            
        } catch (err) {
            
        }
    }

}