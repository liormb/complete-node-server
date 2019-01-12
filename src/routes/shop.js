import express from 'express';
import {
    getIndex,
    getProduct,
    getProducts,
    getCart,
    postCart,
    postDeleteFromCart,
    postOrder,
    getOrders,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart-delete-item', postDeleteFromCart);
router.post('/create-order', postOrder);
router.get('/orders', getOrders);

export default router;
