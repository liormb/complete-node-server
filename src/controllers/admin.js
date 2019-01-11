import Product from '../models/Product';

export function getProducts(req, res) {
    req.user.getProducts()
        .then(products => {
            res.render('layout', {
                route: 'admin_products',
                title: 'Admin Products',
                products,
            });
        })
        .catch(console.log);
}

export function getAddProduct(req, res) {
    res.render('layout', {
        route: 'admin_product_form',
        title: 'Add Product',
        product: {},
    });
}

export function postAddProduct(req, res) {
    const { title, price, imageUrl, description } = req.body;
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description,
    })
    .then(result => {
        console.log('Created Product!');
        res.redirect('/admin/products');
    })
    .catch(console.log);
}

export function getEditProduct(req, res) {
    const { productId } = req.params;

    req.user.getProducts({ where: { id: productId }})
        .then(([product]) => {
            res.render('layout', {
                route: 'admin_product_form',
                title: `Edit Product - ${product.title}`,
                product,
            })
        })
        .catch(console.log);
}

export function postEditProduct(req, res) {
    const { productId } = req.params;
    const { title, price, imageUrl, description } = req.body;

    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product!');
            res.redirect('/admin/products');
        })
        .catch(console.log);
}

export function postDeleteProduct(req, res) {
    const { productId } = req.body;
    Product.findByPk(productId)
        .then(product => product.destroy())
        .then(result => {
            console.log('Destroyed Product!');
            res.redirect('/admin/products');
        })
        .catch(console.log);
}
