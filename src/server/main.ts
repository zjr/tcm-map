import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';

import sfClient from './salesforce/SFClient';

const app = express();
app.use(cors());

app.use(express.json());

function asyncHandler(
	cb: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
	return function (req: Request, res: Response, next: NextFunction) {
		return Promise.resolve(cb(req, res, next)).catch(next);
	};
}

app.get(
	'/accounts',
	asyncHandler(async (_, res) => {
		res.json(await sfClient.getTcmMembersFull());
	})
);

app.post(
	'/accounts/details',
	asyncHandler(async (req, res) => {
		const ids = req.body.ids;
		res.json(await sfClient.getTcmMemberDetails(ids));
	})
);

// app.get('/locations', asyncHandler())

ViteExpress.listen(app, 3000, () =>
	console.log('Server is listening on port 3000...')
);
