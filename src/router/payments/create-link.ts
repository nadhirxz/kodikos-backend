import { Router } from 'express';
import stripe from 'stripe';
import db from '../../utils/db';
import { CustomRequest } from '../../types/server';

const router = Router();

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/', async (req: CustomRequest, res) => {
	const { listingId, processing } = req.body;

	const listing = await db.listing.findUnique({ where: { id: listingId } });

	if (!listing) return res.status(400).json({ error: 'Listing does not exist' });

	const session = await stripeClient.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: { name: listing.title },
					unit_amount: listing.price + processing ? listing.processingPrice : 0,
				},
				quantity: 1,
			},
		],
		metadata: { userId: req.user!.id, listingId, },
		mode: 'payment',
		success_url: `${process.env.FRONTEND_URL!}/listing/${listingId}`,
		cancel_url: `${process.env.FRONTEND_URL!}/listing/${listingId}`,
	});

	res.json({ success: true, session });
});

export default router;