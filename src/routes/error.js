import express from 'express';
import { get404, get500 } from '../controllers/errors';

const router = express.Router();

router.use(get404);
router.use(get500);

export default router;
