import express from 'express';
import isAuth from '../middlewares/isAuth';
import { productValidator } from '../utils/validator';
import {
    getProducts,
    getEditProduct,
    postEditProduct,
    getAddProduct,
    postAddProduct,
    deleteProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/product', isAuth, getAddProduct);
router.post('/product', isAuth, productValidator, postAddProduct);
router.get('/products', isAuth, getProducts);
router.get('/product/:productId', isAuth, getEditProduct);
router.post('/product/:productId', isAuth, productValidator, postEditProduct);
router.delete('/product/:productId', isAuth, deleteProduct);

export default router;
