import { Router } from 'express';
import createLink from './create-link';
import webhook from './webhook';
import { auth } from '../../utils/routeValidation';

const router = Router();

router.use('/create-link', auth, webhook);
router.use('/webhook', auth, createLink);

export default router;
