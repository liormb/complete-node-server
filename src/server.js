import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './utils/database';
import shopRoutes from './routes/shop';
import adminRoutes from './routes/admin';
import errorRoutes from './routes/error';
import User from './models/User';
import Product from './models/Product';
import Cart from './models/Cart';
import CartProduct from './models/CartProduct';

const app = express();

// setup template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setup express body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup static path directory
app.use(express.static(path.join(__dirname, '../public')));

// add first sql user to the request
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(console.log);
});

// setup routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

// setup database and associations (database's relations)
User.hasMany(Product);
User.hasOne(Cart);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartProduct });
Cart.belongsToMany(Product, { through: CartProduct });
Cart.belongsTo(User);

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findByPk(1))
    .then(user => user
        ? Promise.resolve(user)
        : User.create({
            firstName: 'Lior',
            lastName: 'Elrom',
            email: 'liormb@yahoo.com',
        })
    )
    .then(user => Promise.all([user, user.getCart()]))
    .then(([user, cart]) => cart
        ? Promise.resolve(cart)
        : user.createCart()
    )
    .then(() => app.listen(3000))
    .catch(console.log);

