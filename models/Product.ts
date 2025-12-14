import mongoose, { model, models, Schema } from "mongoose";

interface IProduct {
    title: string;
    author: string;
    imageUrl: string;
    price: number;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Product = models?.Product || model<IProduct>('Product', productSchema);

export default Product;