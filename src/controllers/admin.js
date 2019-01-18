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
    const { _id: userId } = req.user;

    Product.find({ userId })
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
    const { _id: userId } = req.user;
    const { productId } = req.params;
    const { title, price, imageUrl, description } = req.body;

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== userId.toString()) {
                return Promise.resolve(['/']);
            }
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return Promise.all(['/admin/products', product.save()]);
        })
        .then(([path]) => res.redirect(path))
        .catch(console.log);
}

export function postDeleteProduct(req, res) {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    Product.deleteOne({ _id: productId, userId })
        .then(() => res.redirect('/admin/products'))
        .catch(console.log);
}
