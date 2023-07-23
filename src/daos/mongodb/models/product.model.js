import mongoose, { Schema } from "mongoose";

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

export const ProductModel = mongoose.model('Product', productSchema);