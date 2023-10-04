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
            logger.error('---> ProductsDao getMany error.', err);
            throw err;
        }
    }
    
    /**
     * 
     * @param {String} id 
     * @param {String || Number} newStock 
     * @description Establece el stock del producto en el valor pasado si newStock es un 'Number'.
     * Modifica el stock incrementándolo o decrementándolo si newStock es un string. Para lo cual, debe comenzar con el signo '-' o '+', y estar seguido por la cantidad de stock a ser agregado o quitado.
     * @returns 
     */
    async updateStock(id, newStock) {
        const stringRegEx = /^[+-][0-9]+$/;
        let result;
        try {
            if (stringRegEx.test(newStock)) {
                // Si se quiere modificar el stock incrementándolo o decrementándolo.
                result = await this.model.findByIdAndUpdate(id, { $inc: { stock: parseInt(newStock) } }, { new: true });
                
            }
            if (typeof newStock === 'number') {
                // Si se quiere establecer el stock en un valor específico.
                result = await this.model.findByIdAndUpdate(id, { $set: { stock: newStock } }, { new: true });
            }

            return result;
        } catch (err) {
            logger.error('---> ProductsDao updateStock error.', err);
            throw err;        
        }
    }
}
