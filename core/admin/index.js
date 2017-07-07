const _ = require('lodash');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const ect = require('ect');
const path = require('path');

module.exports = config => {
	const viewDir = path.resolve(
		__dirname,
		'views'
	);

	const assetDir = path.resolve(
		__dirname,
		'../public/assets'
	);

	const app = express();

	// config static dir
	app.use('/assets', express.static(assetDir));

	// config view engine
	app.set('view engine', 'ect');
	app.set('views', viewDir);
	app.engine('ect', ect({
		watch: true,
		root: viewDir,
		ext: '.ect'
	}).render);

	// config middlewares
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.get('/', (req, res, next) => {
		res.redirect(app.mountpath + '/upload');
	});

	app.get('/upload', (req, res, next) => {
		res.render('upload');
	});

	app.get('/setting', (req, res, next) => {
		res.render('setting', {
			settings: app.parent.get('shared').settings
		});
	});

	app.post('/setting', (req, res, next) => {
		let settings = _.pick(req.body, 'page_title', 'ci_header', 'ci_footer');

		app.parent.get('workers').Setting.save(settings).then(() => {
			res.redirect(app.mountpath + '/setting');
		});
	})

	return app;
};
