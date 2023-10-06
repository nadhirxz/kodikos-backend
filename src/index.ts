import express from 'express';
import dotenv from 'dotenv';
import router from './router';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) ?? 4000;

app.use(express.json());
app.use('/', router);

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
