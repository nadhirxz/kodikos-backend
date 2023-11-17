import { NextFunction, Request, Response } from 'express';
import { z, AnyZodObject } from 'zod';

export const validateRequestSchema = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync(req.body);

		return next();
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(1, 'Name is required'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	position: z.string().min(3, 'Position is required'),
	companyName: z.string().min(3, 'Company name is required'),
	commerceId: z.string().min(3, 'Commerce ID is required'),
	established: z.string().min(3, 'Established date is required'),
});

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});
