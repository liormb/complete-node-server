import { ObjectId } from 'mongodb';
import { getDatabase } from '../utils/database';

class Product {
    static fetchAll() {
        const db = getDatabase();
        return db.collection('products')
            .find()
            .toArray()
            .catch(console.log);
    }
    static findById(id) {
        const db = getDatabase();
        return db.collection('products')
            .find({ _id: new ObjectId(id) })
            .next()
            .catch(console.log);
    }
    static deleteById(id) {
        const db = getDatabase();
        return db.collection('products')
            .deleteOne({ _id: new ObjectId(id) })
            .catch(console.log);
    }
    constructor({ id, title, price, imageUrl, description, userId }) {
        this._id = id ? new ObjectId(id) : null;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.userId = userId;
    }
    save() {
        const db = getDatabase();
        const promise = this._id
            ? db.collection('products').updateOne({ _id: this._id }, { $set: this })
            : db.collection('products').insertOne(this);

        return promise.catch(console.log);
    }
}

export default Product;
