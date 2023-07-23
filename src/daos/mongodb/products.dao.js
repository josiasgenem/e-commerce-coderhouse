import { ProductModel } from './models/product.model.js';

export default class ProductDaoMongoDB {
    
    async getAll(limit) {
        try {
            const response = limit ? 
                await ProductModel.find({}).limit(limit) : 
                await ProductModel.find({});
            return response;
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
