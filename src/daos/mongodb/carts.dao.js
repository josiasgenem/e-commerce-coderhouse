import { CartModel } from "./models/carts.model.js";

export default class CartsDaoMongoDB {
    
    async getAll() {
        try {
            const carts = await CartModel.find();
            
            return carts;
        } catch (err) {
            console.log(err), '---> cartsDao getAll error.';
            return false;
        }
    }
    
    async getById(id) {
        try {
            const cart = await CartModel.findById(id).lean();
            return cart;
        } catch (err) {
            console.log(err, '---> cartsDao getById error.');
            return false;
        }
    }
    
    async create(id, products) {
        try {
            const newCart = await CartModel.create({_id: id, products});
            return newCart;
        } catch (err) {
            console.log(err, '---> cartsDao create error.');
            return false;
        }
    }
    
    async updateAllProducts(cid, products) {
        try {
            const updCart = await CartModel.findByIdAndUpdate(cid, {$set: {products}}, {new: true});
            return updCart;
        } catch (err) {
            console.log(err, '---> cartsDao updateAllProducts error.');
            return false;
        }
    }
    
    async updateProductQty(cid, pid, quantity) {
        try {
            const updCart = await CartModel.findOneAndUpdate({ _id: cid, "products.product": pid }, {$set: {"products.$.quantity": quantity}}, {new: true});
            return updCart;
        } catch (err) {
            console.log(err, '---> cartsDao updateProductQty error.');
            return false;
        }
    }
    
    async removeProduct(cid, pid) {
        try {
            const updCart = await CartModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
            return updCart;
        } catch (err) {
            console.log(err, '---> cartsDao removeProduct error.');
            return false;
        }
    }
    
    async removeAllProducts(id) {
        try {
            const delCart = await CartModel.findByIdAndUpdate(id, { $set: { products: [] }});
            return delCart;
        } catch (err) {
            console.log(err, '---> cartsDao removeAllProducts error.');
            return false;
        }
    }
}