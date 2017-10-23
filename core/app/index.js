const express = require('express');
const ect = require('ect');
const path = require('path');
const random = require('random-int');

module.exports = config => {
	const app = express();

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

			return file + '?_=' + app.parent.get('shared').purgeCache;
		};
		res.locals.upload = media => '/upload' + media.path;
		res.locals.settings = app.parent.get('shared').settings;

		// config
		res.locals.config = app.parent.get('config');
		res.locals.url = req.url;

		next();
	});

	app.get('/', (req, res, next) => {
		res.redirect('/page/1');
	});

	app.get('/page/:page([0-9]+)', (req, res, next) => {
		const currentPage = parseInt(req.params.page, 10);

		if (isNaN(currentPage)) {
			return res.redirect('/page/1');
		}

		const pageSize = app.parent.get('config').pageSize;
		const totalMedia = app.parent.get('shared').mediaCount;

		const totalPage = Math.ceil(totalMedia / pageSize);

		if (currentPage > totalPage || currentPage < 1) {
			return res.redirect('/');
		}

		let nextPage = 0;
		let prevPage = 0;

		if (currentPage === 1) {
			nextPage = currentPage + 1;
			prevPage = totalPage;
		} else if (currentPage === totalPage) {
			prevPage = currentPage - 1;
			nextPage = 1;
		} else {
			nextPage = currentPage + 1;
			prevPage = currentPage - 1;
		}

		res.locals.next = `/page/${nextPage}`;
		res.locals.prev = `/page/${prevPage}`;

		const aliases = [];
		const first = totalMedia - (currentPage - 1) * pageSize;
		const last = totalMedia - (currentPage) * pageSize + 1;

		for (let alias = first; alias > last; alias--) {
			aliases.push(alias);
		}

		app.parent.get('models').Media
			.find({
				alias: {
					$in: aliases
				}
			})
			.sort('-alias')
			.exec()
			.then(media => {
				res.locals.media = media;

				next();
			});
	}, (req, res, next) => {


		res.render('index', {
			siteUrl: config.url,
		});
	});

	app.get('/random', (req, res, next) => {
		let count = app.parent.get('shared').mediaCount;
		let picked = random(count - 1);

		res.redirect('/' + picked);
	});

	app.get('/:alias([0-9]+)', (req, res, next) => {
		let alias = parseInt(req.params.alias, 10);
		let count = app.parent.get('shared').mediaCount;

		let desiredAlias = alias % (count + 1);

		if (alias === 0) {
			return res.redirect('/' + count);
		} else if (desiredAlias === 0) {
			return res.redirect('/1');
		} else if (alias !== desiredAlias) {
			return res.redirect('/' + desiredAlias);
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

		let ratio = (media.height / media.width * 100) + '%';

		res.render('detail', {
			media: media,
			prev: '/' + (media.alias - 1),
			next: '/' + (media.alias + 1),
			siteUrl: `${config.url}/${media.alias}`,
			mediaCount: count,
			ratio: ratio
		});
	});

	app.get('/*', (req, res, next) => {
		res.redirect('/page/1');
	});

	return app;
};
