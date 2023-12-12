import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';

import sfClient from './salesforce/SfClient';

const reseedKey = process.env.RESEED_KEY;

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

app.get('/hello', (_, res) => res.send('Howdy!'));

app.get(
	'/accounts',
	asyncHandler(async (_, res) => {
		res.json(await sfClient.getPinsFull());
	})
);

app.get(
	'/accounts/initial',
	asyncHandler(async (_, res) => {
		res.json(await sfClient.getTcmMembersInitial());
	})
);

app.post(
	'/accounts/filtered',
	asyncHandler(async (req, res) => {
		res.json(await sfClient.getTcmMemberDetails(req.body));
	})
);

app.get(
	'/reseed',
	asyncHandler(async (req, res) => {
		console.log(reseedKey);

		if (req.header('x-reseed-token') !== reseedKey) {
			res.sendStatus(401);
		} else {
			await sfClient.reseedDatabase();
			res.send('OK');
		}
	})
);

const server = ViteExpress.listen(app, 3000, () =>
	console.log('Server is listening on port 3000...')
);

// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
	console.info(
		'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
		new Date().toISOString()
	);
	shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
	console.info(
		'Got SIGTERM (docker container stop). Graceful shutdown ',
		new Date().toISOString()
	);
	shutdown();
});

// shut down server
function shutdown() {
	server.close(function onServerClosed(err) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
}
//
// need above in docker container to properly exit
//
