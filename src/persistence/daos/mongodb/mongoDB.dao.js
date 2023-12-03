import { logger } from "../../../utils/logger.js";

export class MongoDao {
    constructor(model) {
        this.model = model;
    }

    // /**
    //  * @argument query Consulta que se quiere realizar.
    //  * ! DOCUMENTAR BIEN!
    //  * */
    // async getMany(query, { limit = 10, page = 1, sort = 1, lean = false }) {
    //     try {
    //         const opts = {
    //             limit,
    //             page,
    //             sort,
    //             lean
    //         }
    //         const results = await this.model.paginate(query, opts)
    //         return results;

    //     } catch (err) {
    //         logger.error('---> MongoDao getMany error.', err);
    //         throw err;
    //     }
    // }

    async getMany(query) {
        try {
            const results = await this.model.find(query);
            return results;
        } catch (err) {
            logger.error('---> MongoDao getMany error.', err);
            throw err;
        }
    }
    
    async getById(id) {
        try {
            const result = await this.model.findById(id);
            return result;
        } catch (err) {
            logger.error('---> MongoDao getById error.', err);
            throw err;
        }
    }
    
    async create(toCreateObj) {
        try {
            const result = await this.model.create(toCreateObj);
            return result;
        } catch (err) {
            logger.error('---> MongoDao create error.', err);
            throw err;
        }
    }
    
    async update(id, updObj) {
        try {
            const result = await this.model.findByIdAndUpdate(id, updObj, {new: true});
            return result;
        } catch (err) {
            logger.error('---> MongoDao update error.', err);
            throw err;
        }
    }
    
    async remove(id) {
        try {
            const result = await this.model.findByIdAndDelete(id, { new: true });
            return result;
        } catch (err) {
            logger.error('---> MongoDao remove error.', err);
            throw err;
        }
    }
    
    async removeMany(filteredObj) {
        try {
            const result = await this.model.deleteMany(filteredObj);
            return result;
        } catch (err) {
            logger.error('---> MongoDao removeMany error.', err);
            throw err;
        }
    }
}