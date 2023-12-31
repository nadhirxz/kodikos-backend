import { NextFunction, Router } from 'express';
import db from '../utils/db';
import { generateToken } from '../utils/jwt';
import { createId } from '@paralleldrive/cuid2';
import { hashPassword } from '../utils/hash';
import { registerSchema, validateRequestSchema } from '../utils/validation';

const router = Router();

router.post('/', validateRequestSchema(registerSchema), async (req, res) => {
	const { email, name, password, position, companyName, commerceId, established } = req.body;

	const userExists = await db.user.findUnique({ where: { email } });

	if (userExists) return res.status(400).json({ error: 'User already exists' });

	const id = createId();

	const existingCompany = await db.company.findUnique({ where: { commerceId } });

	if (existingCompany) return res.status(400).json({ error: 'Company already exists' });

	const user = await db.user.create({
		data: {
			id,
			email,
			name,
			password: hashPassword(password, id),
			position,
			company: {
				create: {
					name: companyName,
					commerceId,
					established,
				},
			}
		},
	});

	const token = generateToken(user.id);

	res.json({ success: true, token });
});

export default router;
