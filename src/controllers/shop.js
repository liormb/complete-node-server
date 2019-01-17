import Product from '../models/Product';
import Order from '../models/Order';

export function getIndex(req, res) {
    Product.find()
        .then(products => {
            res.render('layout', {
                route: 'index',
                title: 'Shop',
                isAuthenticated: req.session.isLoggedIn,
                products,
            });
        })
        .catch(console.log);
}

export function getProduct(req, res) {
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            res.render('layout', {
                route: 'detail',
                title: product.title,
                isAuthenticated: req.session.isLoggedIn,
                product,
            });
        })
        .catch(console.log);
}

export function getProducts(req, res) {
    Product.find()
        .then(products => {
            res.render('layout', {
                route: 'products',
                title: 'All Products',
                isAuthenticated: req.session.isLoggedIn,
                products,
            });
        })
        .catch(console.log);
}

export function getCart(req, res) {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => ({
                ...item.productId._doc,
                quantity: item.quantity,
            }));
            res.render('layout', {
                route: 'cart',
                title: 'Your Cart',
                isAuthenticated: req.session.isLoggedIn,
                products,
            });
        })
        .catch(console.log);
}

export function postCart(req, res) {
    const { productId } = req.body;
    Product.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function postDeleteFromCart(req, res) {
    const { productId } = req.body;
    req.user.removeFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function postOrder(req, res) {
    const { _id: userId, firstName, lastName, email } = req.user;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => ({
                product: { ...item.productId._doc },
                quantity: item.quantity,
            }));
            const order = new Order({
                user: { userId, firstName, lastName, email },
                products,
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(console.log);
}

export function getOrders(req, res) {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('layout', {
                route: 'orders',
                title: 'Your Orders',
                isAuthenticated: req.session.isLoggedIn,
                orders: orders.map(order => ({
                    _id: order._id,
                    products: order.products.map(product => ({
                        ...product.product,
                        quantity: product.quantity,
                    })),
                })),
            });
        })
        .catch(console.log);
};
