import mongoose, {Schema} from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema({
    _id: { type: Schema.ObjectId, required: true },
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
    // this.id = this._id
    // delete this._id;
    this.populate('products.product');
    next();
})

// cartSchema.plugin(mongoosePaginate);

export const CartModel = mongoose.model('Cart', cartSchema);