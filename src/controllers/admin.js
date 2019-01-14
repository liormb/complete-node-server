import Product from '../models/Product';

export function getAddProduct(req, res) {
    res.render('layout', {
        route: 'admin_product_form',
        title: 'Add Product',
        product: {},
    });
}

export function postAddProduct(req, res) {
    const { _id: userId } = req.user;
    const { title, price, imageUrl, description } = req.body;
    const product = new Product({
        title,
        price,
        imageUrl,
        description,
        userId,
    });
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(console.log);
}

export function getProducts(req, res) {
    Product.fetchAll()
        .then(products => {
            res.render('layout', {
                route: 'admin_products',
                title: 'Admin Products',
                products,
            });
        })
        .catch(console.log);
}

export function getEditProduct(req, res) {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            res.render('layout', {
                route: 'admin_product_form',
                title: `Edit Product - ${product.title}`,
                product,
            })
        })
        .catch(console.log);
}

export function postEditProduct(req, res) {
    const { productId: id } = req.params;
    const { title, price, imageUrl, description } = req.body;
    const product = new Product({ id, title, price, imageUrl, description });

    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(console.log);
}

export function postDeleteProduct(req, res) {
    const { productId } = req.body;
    Product.deleteById(productId)
        .then(() => res.redirect('/admin/products'))
        .catch(console.log);
}
