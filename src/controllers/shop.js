import get from 'lodash.get';
import Product from '../models/Product';

export function getIndex(req, res) {
    Product.findAll()
        .then(products => {
            res.render('layout', {
                route: 'index',
                title: 'Shop',
                products,
            });
        })
        .catch(console.log);
}

export function getProduct(req, res) {
    const { productId } = req.params;
    Product.findByPk(productId)
        .then(product => {
            res.render('layout', {
                route: 'detail',
                title: product.title,
                product,
            });
        })
        .catch(console.log);
}

export function getProducts(req, res) {
    Product.findAll()
        .then(products => {
            res.render('layout', {
                route: 'products',
                title: 'All Products',
                products,
            });
        })
        .catch(console.log);
}

export function getCart(req, res) {
    req.user.getCart()
        .then(cart => cart.getProducts())
        .then(products => {
            res.render('layout', {
                route: 'cart',
                title: 'Your Cart',
                products,
            });
        })
        .catch(console.log);
}

export function postCart(req, res) {
    const { productId } = req.body;
    req.user.getCart()
        .then(cart => Promise.all([
            cart,
            cart.getProducts({ where: { id: productId }}),
        ]))
        .then(([cart, [product]]) => Promise.all([
            cart,
            product || Product.findByPk(productId),
            get(product, 'cartProduct.quantity', 0) + 1 ,
        ]))
        .then(([cart, product, quantity]) => cart.addProduct(product, { through: {quantity} }))
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function postDeleteFromCart(req, res) {
    const { productId } = req.body;
    req.user.getCart()
        .then(cart => cart.getProducts({ where: {id: productId} }))
        .then(([product]) => product.cartProduct.destroy())
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function getOrders(req, res) {
    res.render('layout', {
        route: 'orders',
        title: 'Your Orders',
    });
};

export function getCheckout(req, res) {
    res.render('layout', {
        route: 'checkout',
        title: 'Checkout',
    });
}
