import Product from '../models/Product';
import { validationResult } from 'express-validator/check';
import handleServerError from '../middlewares/handleServerError';

export function getAddProduct(req, res) {
    res.render('layout', {
        route: 'admin_product_form',
        title: 'Add Product',
        product: {},
        validation: {},
        errors: [],
    });
}

export function postAddProduct(req, res) {
    const { _id: userId } = req.user;
    const { title, price, imageUrl, description } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            route: 'admin_product_form',
            title: 'Add Product',
            product: { title, price, imageUrl, description },
            validation: errors.array().map(({ params }) => params),
            errors: errors.array(),
        });
    }
    const product = new Product({
        title,
        price,
        imageUrl,
        description,
        userId,
    });
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(handleServerError);
}

export function getProducts(req, res) {
    const { _id: userId } = req.user;

    Product.find({ userId })
        .then(products => {
            res.render('layout', {
                route: 'admin_products',
                title: 'Admin Products',
                products,
            });
        })
        .catch(handleServerError);
}

export function getEditProduct(req, res) {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('layout', {
                route: 'admin_product_form',
                title: `Edit Product - ${product.title}`,
                product,
                validation: {},
                errors: [],
            })
        })
        .catch(handleServerError);
}

export function postEditProduct(req, res) {
    const { _id } = req.user;
    const { productId } = req.params;
    const { title, price, imageUrl, description } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            route: 'admin_product_form',
            title: `Edit Product - ${product.title}`,
            product: { _id, title, price, imageUrl, description },
            validation: errors.array().map(({ params }) => params),
            errors: errors.array(),
        });
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== _id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(handleServerError);
}

export function postDeleteProduct(req, res) {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    Product.deleteOne({ _id: productId, userId })
        .then(() => res.redirect('/admin/products'))
        .catch(handleServerError);
}
