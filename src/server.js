import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import errorRoutes from './routes/error';
import User from './models/User';

dotenv.config();

const app = express();
const DATABASE_NAME = 'shop';
const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@projects0-ofgts.mongodb.net/${DATABASE_NAME}`;
const MongoDBStore = mongoDBSession(session);

// setup template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setup express body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup static path directory
app.use(express.static(path.join(__dirname, '../public')));

// setup session configuration
app.use(session({
    secret: 'My Secret String',
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions',
    }),
}));

// add first user to the request body
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(console.log);
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

// setup mongodb connection
mongoose
    .connect(MONGODB_URI)
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

