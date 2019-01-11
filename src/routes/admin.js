import express from 'express';
import {
    getProducts,
    getEditProduct,
    postEditProduct,
    getAddProduct,
    postAddProduct,
    postDeleteProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/products', getProducts);
router.get('/product/:productId', getEditProduct);
router.post('/product/:productId', postEditProduct);
router.get('/product', getAddProduct);
router.post('/product', postAddProduct);
router.post('/delete-product', postDeleteProduct);

export default router;