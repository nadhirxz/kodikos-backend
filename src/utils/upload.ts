import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export const uploadFile = (name: string, options?: multer.Options) => (req: Request, res: Response, next: NextFunction) => {
	const upload = multer(options).single(name);

	upload(req, res, err => {
		if (err) {
			return res.status(400).json({
				success: false,
				message: err.message,
				code: err.code,
			});
		}

		next();
	});
};

export const uploadBlob = async (fileName: string, buffer: Buffer, container: string, contentType?: string) => {
	try {
		const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_BLOB_ACCOUNT!, process.env.AZURE_BLOB_ACCOUNT_KEY!);
		const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_BLOB_ACCOUNT!}.blob.core.windows.net`, sharedKeyCredential);

		const containerClient = blobServiceClient.getContainerClient(container);
		const blockBlobClient = containerClient.getBlockBlobClient(fileName);
		await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType ?? 'image/jpeg' } });

		return blockBlobClient.url;
	} catch (err) {
		return false;
	}
};
