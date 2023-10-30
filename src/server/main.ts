import express from 'express';
import ViteExpress from 'vite-express';

import cors from 'cors';
import * as url from 'url';

const app = express();
app.use(cors());

function getOrigin(req: express.Request) {
	return url.format({ protocol: req.protocol, host: req.get('host') });
}

app.get('/load', (req, res) => {
	const origin = getOrigin(req);
	console.log(`hi from ${origin}`);
	res.render('index', { origin });
});

ViteExpress.listen(app, 3000, () =>
	console.log('Server is listening on port 3000...')
);
