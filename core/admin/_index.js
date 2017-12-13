const _ = require('lodash');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const ect = require('ect');
const express = require('express');
const path = require('path');
const session = require('express-session');

const dashboard = require('./controllers/dashboard')

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
	const passport = require('./passport')(config);

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

	let RedisStore = require('connect-redis')(session);

	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
		store: new RedisStore({
			host: config.redis.host,
			port: config.redis.port
		})
	}));

	// check authentication
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/oauth/gg', passport.authenticate('google'));

	app.get('/oauth/gg/callback',
		passport.authenticate('google', {
			failureRedirect: '/admin/login'
		}),
		(req, res) => {
		// Successful authentication, redirect home.
			res.redirect('/admin');
		}
	);

	app.get('/logout', (req, res, next) => {
		req.logout();

		res.redirect('/');
	});

	app.get('/login', (req, res, next) => {
		res.render('login');
	});

	app.use((req, res, next) => {
		if (req.user) {
			res.locals.user = req.user;
			return next();
		}

		res.redirect('/admin/login');
	});

	app.get('/', dashboard.systemInfo())

	app.get('/purge-mem-cache', dashboard.purgeMemCache())

	app.get('/re-index', dashboard.reIndex())

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
