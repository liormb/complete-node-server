import { Router } from 'express';
import {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
} from '../controllers/auth';

const router = new Router();

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);

export default router;
