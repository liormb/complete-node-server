import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import shopRoutes from './routes/shop';
import adminRoutes from './routes/admin';
import errorRoutes from './routes/error';
import User from './models/User';

const app = express();
const database = 'shop';

dotenv.config();

// setup template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setup express body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup static path directory
app.use(express.static(path.join(__dirname, '../public')));

// add first user to the request body
app.use((req, res, next) => {
    User.findById('5c3d321ae453bed97a31e9bc')
        .then(user => {
            req.user = user;
            return user.save();
        })
        .then(() => next())
        .catch(console.log);
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

// setup mongodb connection
mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@projects0-ofgts.mongodb.net/${database}?retryWrites=true`)
    .then(() => User.findOne())
    .then(user => {
        if (!user) {
            user = new User({
                firstName: 'Lior',
                lastName: 'Elrom',
                email: 'liormb@yahoo.com',
                cart: [],
            });
        }
        return user.save();
    })
    .then(() => app.listen(3000))
    .catch(console.log);

