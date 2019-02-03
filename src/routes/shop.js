import express from 'express';
import isAuth from '../middlewares/isAuth';
import {
    getIndex,
    getProduct,
    getProducts,
    getCart,
    postCart,
    postDeleteFromCart,
    getOrders,
    getInvoice,
    getCheckout,
    postCheckout,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);
router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.post('/cart-delete-item', isAuth, postDeleteFromCart);
router.get('/orders', isAuth, getOrders);
router.get('/orders/:orderId', isAuth, getInvoice);
router.get('/checkout', isAuth, getCheckout)
router.post('/checkout', isAuth, postCheckout);

export default router;
