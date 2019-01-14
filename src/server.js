import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import shopRoutes from './routes/shop';
import adminRoutes from './routes/admin';
import errorRoutes from './routes/error';
import mongoConnect from './utils/database';
import User from './models/User';

const app = express();

// setup template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setup express body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup static path directory
app.use(express.static(path.join(__dirname, '../public')));

// add first user to the request body
app.use((req, res, next) => {
    User.findById('5c3b9e43a16aa8bc240e0e7b')
        .then(user => {
            req.user = new User({ id: user._id, ...user });
            next();
        })
        .catch(console.log);
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

// setup database and associations (database's relations)
mongoConnect(() => {
    app.listen(3000);
});    

