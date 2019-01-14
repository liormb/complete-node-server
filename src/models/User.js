import { ObjectId } from 'mongodb';
import { getDatabase } from '../utils/database';

class User {
    static findById(id) {
        const db = getDatabase();
        return db.collection('users')
            .find({ _id: new ObjectId(id) })
            .next()
            .catch(console.log);
    }
    constructor({ id, firstName, lastName, email, cart }) {
        this._id = id ? new ObjectId(id) : null;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.cart = cart || { items: [] };
    }
    save() {
        const db = getDatabase();
        return db.collection('users')
            .insertOne(this)
            .catch(console.log);
    }
    getCart() {
        const db = getDatabase();
        const productIds = this.cart.items.map(item => item.productId);
        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => products.map(product => ({
                ...product,
                quantity: this.cart.items.find(
                    item => item.productId.toString() === product._id.toString()
                ).quantity,
            })))
            .catch(console.log)
    }
    addToCart(product) {
        const db = getDatabase();
        const cart = {...this.cart};
        const productId = new ObjectId(product._id);
        const index = this.cart.items.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (index > -1) {
            cart.items[index].quantity += 1;
        } else {
            cart.items.push({
                productId,
                quantity: 1,
            });
        }
        return db.collection('users')
            .updateOne({ _id: this._id }, { $set: { cart } })
            .catch(console.log);
    }
    deleteFromCartByProductId(id) {
        const db = getDatabase();
        const items = this.cart.items.filter(
            item => item.productId.toString() !== id.toString()
        );
        return db.collection('users')
            .updateOne(
                { _id:  new ObjectId(this._id) },
                { $set: { cart: { items } } },
            )
            .catch(console.log);
    }
    addOrder() {
        const db = getDatabase();
        return this.getCart()
            .then(products => ({
                user: {
                    _id: new ObjectId(this._id),
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                },
                items: products,
            }))
            .then(order => db.collection('orders').insertOne(order))
            .then(() => {
                this.cart = { items: [] };
                return db.collection('users').updateOne(
                    { _id: new ObjectId(this._id) },
                    { $set: { cart: { items: [] } } },
                );
            })
            .catch(console.log);
    }
    getOrders() {
        const db = getDatabase();
        return db.collection('orders')
            .find({ 'user._id': new ObjectId(this._id) })
            .toArray()
            .catch(console.log);
    }
}

export default User;
