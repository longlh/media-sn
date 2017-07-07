const express = require('express');
const ect = require('ect');
const path = require('path');
const random = require('random-int');

const themeName = 'default';
const themeDir = path.resolve(
	__dirname,
	'../../content/themes',
	themeName
);
const libDir = path.resolve(
	__dirname,
	'../../node_modules'
);
const uploadDir = path.resolve(
	__dirname,
	'../../content/upload'
);

const app = module.exports = express();

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
	res.locals.asset = file => file + '?_=' + Date.now();
	res.locals.upload = media => '/upload' + media.path;

	// config
	res.locals.config = app.parent.get('config');

	next();
});

app.get('/', (req, res, next) => {
	let count = app.parent.get('shared').mediaCount;
	let picked = random(count - 1);

	res.redirect('/' + picked);
});

app.get('/:alias', (req, res, next) => {
	let alias = req.params.alias;
	let count = app.parent.get('shared').mediaCount;

	app.parent.get('models').Media
		.findOne({
			alias: alias
		})
		.then(media => {
			if (!media) {
				return res.redirect('/');
			}

			res.render('index', {
				media: media,
				prev: media.alias > 0 ?
					'/' + (media.alias - 1) : '#',
				next: media.alias < count - 1 ?
					'/' + (media.alias + 1) : '#'
			});
		});
});
