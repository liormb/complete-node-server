import dotenv from 'dotenv';
import Stripe from 'stripe';
import Product from '../models/Product';
import Order from '../models/Order';
import { createOrderInvoice } from '../utils/invoiceHelpers';
import handleServerError from '../middlewares/handleServerError';

dotenv.config();

const ITEMS_PER_PAGE = 4;

function getCartItems(user) {
    return user.cart.items.map(item => ({
        product: { ...item.productId._doc },
        quantity: item.quantity,
    }));
}

function getTotal(products) {
    return products.reduce((sum, { product, quantity }) =>
        sum + (product.price * quantity)
    , 0);
}

export function getIndex(req, res, next) {
    const page = Number(req.query.page) || 1;

    Product.find()
        .countDocuments()
        .then(totalProducts => Promise.all([
            totalProducts,
            Product.find()
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
        ]))
        .then(([totalProducts, products]) => {
            const pages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
            res.render('layout', {
                route: 'index',
                title: 'Shop',
                pages: [...Array(pages)].map((v, i) => ++i),
                currentPage: page,
                lastPage: pages,
                nextPage: page + 1,
                previousPage: page - 1,
                hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
                hasPreviousPage: page > 1,
                products,
            });
        })
        .catch(err => handleServerError(next, err));
}

export function getProduct(req, res, next) {
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            res.render('layout', {
                route: 'detail',
                title: product.title,
                product,
            });
        })
        .catch(err => handleServerError(next, err));
}

export function getProducts(req, res, next) {
    const page = Number(req.query.page) || 1;

    Product.find()
        .countDocuments()
        .then(totalProducts => Promise.all([
            totalProducts,
            Product.find()
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
        ]))
        .then(([totalProducts, products]) => {
            const pages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
            res.render('layout', {
                route: 'products',
                title: 'All Products',
                pages: [...Array(pages)].map((v, i) => ++i),
                currentPage: page,
                lastPage: pages,
                nextPage: page + 1,
                previousPage: page - 1,
                hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
                hasPreviousPage: page > 1,
                products,
            });
        })
        .catch(err => handleServerError(next, err));
}

export function getCart(req, res, next) {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render('layout', {
                route: 'cart',
                title: 'Your Cart',
                products: getCartItems(user),
            });
        })
        .catch(err => handleServerError(next, err));
}

export function postCart(req, res, next) {
    const { productId } = req.body;
    Product.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(err => handleServerError(next, err));
}

export function postDeleteFromCart(req, res, next) {
    const { productId } = req.body;
    req.user.removeFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(err => handleServerError(next, err));
}

export function getOrders(req, res, next) {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('layout', {
                route: 'orders',
                title: 'Your Orders',
                orders: orders.map(order => ({
                    _id: order._id,
                    products: order.products.map(({ product, quantity }) => ({
                        ...product,
                        quantity,
                    })),
                })),
            });
        })
        .catch(err => handleServerError(next, err));
};

export function getInvoice(req, res, next) {
    const { orderId } = req.params;

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return handleServerError(next, 'No order found');
            } else if (order.user.userId.toString() !== req.user._id.toString()) {
                return handleServerError(next, 'You are unauthorized to review this invoice!');
            }
            createOrderInvoice(res, order);
        })
        .catch(err => handleServerError(next, err));
}

export function getCheckout(req, res, next) {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = getCartItems(user);
            res.render('layout', {
                route: 'checkout',
                title: 'Checkout Page',
                products,
                total: getTotal(products),
            });
        })
        .catch(err => handleServerError(next, err));
}

export function postCheckout(req, res, next) {
    const { stripeToken } = req.body;
    const { _id: userId, firstName, lastName, email } = req.user;
    const stripe = Stripe(process.env.STRIPE_TOKEN);

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = getCartItems(user);
            const order = new Order({
                user: { userId, firstName, lastName, email },
                products,
            });
            return Promise.all([products, order.save()]);
        })
        .then(([products, order]) => {
            return stripe.charges.create({
                amount: getTotal(products) * 100,
                currency: 'usd',
                description: 'Charge',
                source: stripeToken,
                metadata: {
                    order_id: order._id.toString(),
                },
            });
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(err => handleServerError(next, err));
}
