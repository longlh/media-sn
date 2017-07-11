const express = require('express');
const ect = require('ect');
const path = require('path');
const random = require('random-int');

module.exports = config => {
	const app = express();
	const timestamp = Date.now();

	const themeName = 'default';
	const themeDir = path.resolve(
		__dirname,
		'../../content/themes',
		config.theme
	);
	const libDir = path.resolve(
		__dirname,
		'../../node_modules'
	);
	const uploadDir = path.resolve(
		__dirname,
		'../../content/upload'
	);

	// config static dir
	app.use(express.static(themeDir));
	app.use('/libs', express.static(libDir));
	app.use('/upload', express.static(uploadDir));

	// config view engine
	app.set('view engine', 'ect');
	app.set('views', themeDir);
	app.engine('ect', ect({
		watch: true,
		root: themeDir,
		ext: '.ect'
	}).render);

	// route
	app.use('/', (req, res, next) => {
		// view helper
		res.locals.asset = file => {
			if (config.debug) {
				return file + '?_=' + Date.now();
			}

			return file + '?_=' + timestamp;
		};
		res.locals.upload = media => '/upload' + media.path;
		res.locals.settings = app.parent.get('shared').settings;

		// config
		res.locals.config = app.parent.get('config');

		next();
	});

	app.get('/', (req, res, next) => {
		let count = app.parent.get('shared').mediaCount;
		let picked = random(count - 1);

		res.redirect('/' + picked);
	});

	app.get('/:alias([0-9]+)', (req, res, next) => {
		let alias = parseInt(req.params.alias, 10);
		let count = app.parent.get('shared').mediaCount;

		if (alias < 0 || alias > count - 1) {
			return res.redirect('/');
		}

		let cache = app.parent.get('shared').cache;

		if (cache[alias]) {
			res.locals.media = cache[alias];

			return next();
		}

		app.parent.get('models').Media
			.findOne({
				alias: alias
			})
			.lean()
			.then(media => {
				if (!media) {
					return res.redirect('/');
				}

				res.locals.media = cache[alias] = media;

				next();
			});
	}, (req, res, next) => {
		let count = app.parent.get('shared').mediaCount;
		let media = res.locals.media;

		res.render('index', {
			media: media,
			prev: media.alias > 0 ?
				'/' + (media.alias - 1) : '#',
			next: media.alias < count - 1 ?
				'/' + (media.alias + 1) : '#',
			siteUrl: `${req.protocol}://${req.hostname}/${media.alias}`,
		});
	});

	return app;
};
