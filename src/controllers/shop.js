import get from 'lodash.get';
import Product from '../models/Product';

export function getIndex(req, res) {
    Product.fetchAll()
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
    Product.findById(productId)
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
    Product.fetchAll()
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
    Product.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function postDeleteFromCart(req, res) {
    const { productId } = req.body;
    req.user.deleteFromCartByProductId(productId)
        .then(() => res.redirect('/cart'))
        .catch(console.log);
}

export function postOrder(req, res) {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch(console.log);
}

export function getOrders(req, res) {
    req.user.getOrders()
        .then(orders => {
            res.render('layout', {
                route: 'orders',
                title: 'Your Orders',
                orders,
            });
        })
        .catch(console.log);
};
