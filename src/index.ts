import express from 'express';
import dotenv from 'dotenv';
import router from './router';
import { verifyToken } from './utils/jwt';
import db from './utils/db';
import cors from 'cors';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT!) ?? 4000;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/', router);

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
