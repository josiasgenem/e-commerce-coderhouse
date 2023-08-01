import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
})

cartSchema.pre(/^find/, function (next) {
    this.populate('products.product');
    next();
})

// cartSchema.plugin(mongoosePaginate);

export const CartModel = mongoose.model('Cart', cartSchema);