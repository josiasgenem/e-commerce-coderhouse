import { CartModel } from "./models/carts.model.js";
import { MongoDao } from "./mongoDB.dao.js";

export default class CartsDaoMongoDB extends MongoDao {
    constructor() {
        super(CartModel);
    }
    
    async updateAllProducts(cartId, products) {
        try {
            const updCart = await this.model.findByIdAndUpdate(cartId, {$set: {products}}, {new: true});
            return updCart;
        } catch (err) {
            console.log(err, '---> CartsDaoMongo updateAllProducts error.');
            throw err;
        }
    }
    
    async updateProductQty(cartId, productId, quantity) {
        try {
            const updCart = await this.model.findOneAndUpdate({ _id: cartId, "products.product": productId }, {$set: {"products.$.quantity": quantity}}, {new: true});
            return updCart;
        } catch (err) {
            console.log(err, '---> CartsDaoMongo updateProductQty error.');
            throw err;
        }
    }
    
    async removeOneProduct(cartId, productId) {
        try {
            const updCart = await this.model.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });
            return updCart;
        } catch (err) {
            console.log(err, '---> CartsDaoMongo removeOneProduct error.');
            throw err;
        }
    }
    
    async removeAllProducts(cartId) {
        try {
            const delCart = await this.model.findByIdAndUpdate(cartId, { $set: { products: [] }});
            return delCart;
        } catch (err) {
            console.log(err, '---> CartsDaoMongo removeAllProducts error.');
            throw err;
        }
    }
}