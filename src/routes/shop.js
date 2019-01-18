import express from 'express';
import isAuth from '../middlewares/isAuth';
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
router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.post('/cart-delete-item', isAuth, postDeleteFromCart);
router.post('/create-order', isAuth, postOrder);
router.get('/orders', isAuth, getOrders);

export default router;
