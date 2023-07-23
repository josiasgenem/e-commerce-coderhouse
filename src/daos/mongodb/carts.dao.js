import { CartModel } from "./models/carts.model.js";

export default class CartsDaoMongoDB {
    
    async getAll(limit) {
        try {
            const response = limit ?
                await CartModel.find({}):
                await CartModel.find({}).limit(limit);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    
    async getById(id) {
        try {
            const response = await CartModel.findById(id);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    
    async create(products) {
        try {
            const response = await CartModel.create({products});
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    
    async updateProducts(cid, products) {
        try {
            const response = await CartModel.findByIdAndUpdate(cid, {$set: {products}}, {new: true});
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    
    async remove(id) {
        try {
            const response = await CartModel.findByIdAndDelete(id);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}