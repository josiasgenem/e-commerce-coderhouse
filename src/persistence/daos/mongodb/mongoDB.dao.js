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
    //         console.log(err, '---> MongoDao getMany error.');
    //         throw err;
    //     }
    // }

    async getMany(query) {
        try {
            const results = await this.model.find(query);
            return results;
        } catch (err) {
            console.log(err, '---> MongoDao getMany error.');
            throw err;
        }
    }
    
    async getById(id) {
        try {
            const result = await this.model.findById(id);
            console.log(result, 'CART FROM MONGO DAO');
            return result;
        } catch (err) {
            console.log(err, '---> MongoDao getById error.');
            throw err;
        }
    }
    
    async create(toCreateObj) {
        try {
            const result = await this.model.create(toCreateObj);
            return result;
        } catch (err) {
            console.log(err, '---> MongoDao create error.');
            throw err;
        }
    }
    
    async update(id, updObj) {
        try {
            const result = await this.model.findByIdAndUpdate(id, updObj, {new: true});
            return result;
        } catch (err) {
            console.log(err, '---> MongoDao update error.');
            throw err;
        }
    }
    
    async remove(id) {
        try {
            const result = await this.model.findByIdAndDelete(id, { new: true });
            return result;
        } catch (err) {
            console.log(err, '---> MongoDao remove error.');
            throw err;
        }
    }
}