import express from 'express';
import { get404 } from '../controllers/errors';

const router = express.Router();

router.use(get404);

export default router;
