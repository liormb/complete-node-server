import get from 'lodash.get';
import Product from '../models/Product';
import { validationResult } from 'express-validator/check';
import { deleteFile } from '../utils/fileHelpers';
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

export function postAddProduct(req, res, next) {
    const { _id: userId } = req.user;
    const { title, price, description } = req.body;
    const imageUrl = get(req.file, 'path');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            route: 'admin_product_form',
            title: 'Add Product',
            product: { title, price, description },
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
        .catch(err => handleServerError(next, err));
}

export function getProducts(req, res, next) {
    const { _id: userId } = req.user;

    Product.find({ userId })
        .then(products => {
            res.render('layout', {
                route: 'admin_products',
                title: 'Admin Products',
                products,
            });
        })
        .catch(err => handleServerError(next, err));
}

export function getEditProduct(req, res, next) {
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
        .catch(err => handleServerError(next, err));
}

export function postEditProduct(req, res, next) {
    const { _id } = req.user;
    const { productId } = req.params;
    const { title, price, description } = req.body;
    const imageUrl = get(req.file, 'path');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('layout', {
            route: 'admin_product_form',
            title: 'Edit Product',
            product: { _id, title, price, description },
            validation: errors.array().map(({ params }) => params),
            errors: errors.array(),
        });
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== _id.toString()) {
                return res.redirect('/');
            }
            if (imageUrl) {
                deleteFile(next, imageUrl);
                product.imageUrl = imageUrl;
            }
            product.title = title;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => handleServerError(next, err));
}

export function deleteProduct(req, res, next) {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return handleServerError(next, 'Product not found');
            }
            deleteFile(next, product.imageUrl);
            return Product.deleteOne({ _id: productId, userId });
        })
        .then(() => res.status(200).json({
            message: 'Success',
        }))
        .catch(error => res.status(500).json({
            message: 'Deleting product fail',
            error,
        }));
}
