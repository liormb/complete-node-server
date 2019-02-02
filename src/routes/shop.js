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
    getInvoice,
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
router.get('/orders/:orderId', isAuth, getInvoice);

export default router;
