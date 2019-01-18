import { Router } from 'express';
import {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getResetPassword,
    postResetPassword,
    getNewPassword,
    postNewPassword,
} from '../controllers/auth';

const router = new Router();

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);
router.get('/new-password/:token', getNewPassword);
router.post('/new-password', postNewPassword);

export default router;
