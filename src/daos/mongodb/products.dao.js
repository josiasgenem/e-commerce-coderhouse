import { ProductModel } from './models/product.model.js';

export default class ProductDaoMongoDB {
    
    async getAll(query, { limit, page, sort }) {
        try {
            const opts = {
                limit,
                page,
                sort: {
                    price: sort
                },
                lean: true
            }
            const products = await ProductModel.paginate(query, opts)
            return products;

        } catch (err) {
            console.log(err);
        }
    }

    async getById(id) {
        try {
            const response = await ProductModel.findById(id);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    async create(product) {
        try {
            const response = await ProductModel.create({...product});
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    async update(id, obj) {
        try {
            const response = await ProductModel.findByIdAndUpdate(id, obj);
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    async remove(id) {
        try {
            const response = await ProductModel.findByIdAndDelete(id);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}
