import { Response, Router } from 'express';
import db from '../../utils/db';
import { CustomRequest } from '../../types/server';

const router = Router();

router.post('/', async (req: CustomRequest, res: Response) => {
	// create new data listing
	const { title, description, price, dataId } = req.body;
	const { user } = req;

	if (!title || !description || !price)
		return res.status(400).json({
			success: false,
			message: 'Missing fields',
		});

	try {
		const data = await db.data.findUnique({
			where: {
				id: dataId,
			},
		});

		const listing = await db.listing.create({
			data: {
				title,
				price,
				data: { connect: { id: dataId } },
				processingPrice: 10,
			},
		});

		return res.json({ success: true, data, listingId: listing.id });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			code: 'INTERNAL_SERVER_ERROR',
		});
	}
});

export default router;
