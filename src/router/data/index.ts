import { Router } from 'express';
import uploadRouter from './upload';
import { auth } from '../../utils/routeValidation';

const router = Router();

router.use('/upload', auth, uploadRouter);

export default router;
