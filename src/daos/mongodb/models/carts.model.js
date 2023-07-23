import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema({
    products: [{
        productId: {type: mongoose.Schema.Types.ObjectId, required: true},
        quantity: {type: Number, required: true}
    }]
})

export const CartModel = mongoose.model('Cart', cartSchema);