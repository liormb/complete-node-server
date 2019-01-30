import path from 'path';
import dotenv from 'dotenv';
import csrf from 'csurf';
import flash from 'connect-flash';
import express from 'express';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import addUser from './middlewares/addUser';

// routes
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import errorRoutes from './routes/error';

dotenv.config();

const DATABASE_NAME = 'shop';
const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@projects0-ofgts.mongodb.net/${DATABASE_NAME}`;
const MongoDBStore = mongoDBSession(session);

const app = express();

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

// setup csrf site protection
app.use(csrf());

// setup flash messages used by sessions
app.use(flash());

// add first user to the request body
app.use(addUser);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

// setup mongodb connection
// and start listening on port 3000
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => app.listen(3000))
    .catch(console.log);

