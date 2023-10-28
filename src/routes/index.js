const express = require('express');
const router = express.Router();

const url = require('url');

function getOrigin(req) {
	return url.format({
		protocol: req.protocol,
		host: req.get('host')
	});
}

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { styleHref: getOrigin(req) + '/main.css' });
});

module.exports = router;
