import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnails: [{ type: String }]
})

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);