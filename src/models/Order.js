import { Schema, model } from 'mongoose';
import User from './User';

const schema = new Schema({
    products: [
        {
            product: {
                type: Object,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    }
});

export default model('Order', schema);
