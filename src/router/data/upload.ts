import type { Request, Response } from 'express';
import { Router } from 'express';
import { uploadBlob, uploadFile } from '../../utils/upload';
import multer from 'multer';
import db from '../../utils/db';
import { createId } from '@paralleldrive/cuid2';
import { CustomRequest } from '../../types/server';

const router = Router();

router.post('/', uploadFile('data', { limits: { fileSize: 10000000 }, storage: multer.memoryStorage() }), async (req: CustomRequest, res: Response) => {
	const { user } = req;
	const { title, description, price } = req.body;

	if (req.file) {
		try {
			const id = createId();
			const url = await uploadBlob(id, req.file.buffer, process.env.AZURE_BLOB_AVATARS!);

			if (!url)
				return res.status(500).json({
					success: false,
					message: 'Internal server error',
					code: 'INTERNAL_SERVER_ERROR',
				});

			await db.data.create({
				data: {
					id,
					title,
					description,
					url,
					owner: { connect: { id: user!.id } },
				},
			});

			return res.json({ success: !!url, avatar: url });
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
				code: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	return res.status(400).json({
		success: false,
		message: 'No file was provided',
	});
});

export default router;
