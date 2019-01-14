import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const database = 'shop';
let _db;

dotenv.config();

export default function mongoConnect(callback) {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@projects0-ofgts.mongodb.net/${database}?retryWrites=true`, {
        useNewUrlParser: true,
    })
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function getDatabase() {
    return _db
        ? _db
        : new Error('No Database Found!');
}
