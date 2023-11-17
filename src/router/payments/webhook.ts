import { Router } from 'express';
import stripe, { Stripe } from 'stripe';
import db from '../../utils/db';
import axios from 'axios';

const router = Router();

router.post('/', async (req, res) => {
	const payload = req.body;
	const sig = req.headers['stripe-signature'];

	if (!sig) return res.status(400).send('No signature');

	let event: stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, process.env.ENDPOINT_SECRET!);
	} catch (err) {
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	const session = event.data.object as Stripe.Checkout.Session;

	const userId = session.metadata!.userId as string;
	const processing = session.metadata!.processing as unknown as boolean;

	const listing = await db.listing.findUnique({
		where: { id: session.metadata!.listingId as string },
		include: {
			data: true,
		},
	});

	if (!listing) return res.status(400).json({ error: 'Listing does not exist' });

	if (processing)
		try {
			await axios.post(process.env.PROCESSING_ENDPOINT!, { dataId: listing.data.id });
		} catch (error) {
			return res.status(400).json({ error: 'Error processing listing' });
		}

	await db.$transaction(async tx => {
		await tx.data.update({
			where: { id: listing.data.id },
			data: { owner: { connect: { id: userId } } },
		});

		await tx.listing.delete({ where: { id: listing.id } });

		await tx.transaction.create({
			data: {
				seller: { connect: { id: listing.data.ownerId } },
				buyer: { connect: { id: userId } },
				price: listing.price + (processing ? 0 : listing.processingPrice),
				extraServices: processing
					? undefined
					: {
							create: {
								type: 'processing',
								price: listing.processingPrice,
							},
					  },
			},
		});
	});

	res.status(200).end();
});

export default router;
