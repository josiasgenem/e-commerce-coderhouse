import { ProductModel } from './models/product.model.js';
import { MongoDao } from './mongoDB.dao.js';

export default class ProductsDaoMongoDB extends MongoDao {
    constructor() {
        super(ProductModel);
    }

    /**
     * @argument query Consulta que se quiere realizar.
     * ! DOCUMENTAR BIEN!
     * */
    async getMany(query, { limit = 10, page = 1, sort = 1, lean = false }) {
        try {
            const opts = {
                limit,
                page,
                sort,
                lean
            }
            const results = await this.model.paginate(query, opts)
            return results;

        } catch (err) {
            console.log(err, '---> ProductsDao getMany error.');
            throw err;
        }
    }
}
