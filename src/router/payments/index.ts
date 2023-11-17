import { Router } from 'express';
import createLink from './create-link';
import { auth } from '../../utils/routeValidation';

const router = Router();

router.use('/create-link', auth, createLink);

export default router;
