import { logger } from '../../../utils/logger.js';
import { UserModel } from './models/users.model.js';
import { MongoDao } from './mongoDB.dao.js';

export default class UserDaoMongoDB extends MongoDao {
    constructor() {
        super(UserModel);
    }
    
    async getById(id, returnPass = false) {
        const selects = [];
        if(returnPass) selects.push('+password');
    
        try {
            const user = selects.length > 0 ?
                            await this.model.findById(id, selects) :
                            await this.model.findById(id);
            if (!user) return false;
            return user;
        } catch (err) {
            logger.error('---> UserDaoMongo getById error.', err);
            throw err;
        }
    }

    async getByEmail(email, returnPass = false ) {
        const selects = [];
        if(returnPass) selects.push('+password');

        try {
            const user = selects.length > 0 ?
                            await this.model.findOne({ email }, selects) :
                            await this.model.findOne({ email });
            if (!user) return false;
            return user;
        } catch (err) {
            logger.error('---> UserDaoMongo getByEmail error.', err);
            throw err;                                                               
        }
    }

    async updateByEmail(email, toUpdateObj) {
        try {
            const user = await this.model.findOneAndUpdate({email}, toUpdateObj, {new: true})
            if(!user) return false;
            return user;
        } catch (err) {
            logger.error('---> UserDaoMongo updateByEmail error.', err);
            throw err
        }
    }
    
    async saveRefreshToken(email, refreshToken) {
        try {
            const user = await this.model.findOne({email});
            const existToken = user.refreshTokens.some(token => refreshToken === token);
            if(existToken) return false;

            user.refreshTokens.push(refreshToken);
            return await user.save();
        } catch (err) {
            logger.error('---> UserDaoMongo saveRefreshToken error.', err);
            throw err
        }
    }
}