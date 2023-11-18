import { Router } from 'express';
import loginRouter from './login';
import registerRouter from './register';
import paymentsRouter from './payments';
import dataRouter from './data';
import { noAuth } from '../utils/routeValidation';

const router = Router();

router.use('/register', noAuth, registerRouter);
router.use('/login', noAuth, loginRouter);
router.get('/payments', paymentsRouter);
router.get('/data', dataRouter);
router.get('/', (req, res) => {
	res.send('API');
});

export default router;
