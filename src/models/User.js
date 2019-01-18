import { Schema, model } from 'mongoose';

const schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Date,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
    },
});

schema.methods.addToCart = function (product) {
    const productId = product._id;
    const items = [...this.cart.items];
    const index = this.cart.items.findIndex(
        item => item.productId.toString() === productId.toString()
    );

    if (index > -1) {
        items[index].quantity += 1;
    } else {
        items.push({
            productId,
            quantity: 1,
        });
    }
    this.cart = { items };
    return this.save()
};

schema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item =>
        item.productId.toString() !== productId.toString()
    );
    return this.save();
}

schema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

export default model('User', schema);
