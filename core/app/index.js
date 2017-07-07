const express = require('express');
const ect = require('ect');
const path = require('path');

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

const app = module.exports = express();

// config static dir
app.use(express.static(themeDir));
app.use('/lib', express.static(libDir));

// config view engine
app.set('view engine', 'ect');
app.engine('ect', ect({
	watch: true,
	root: themeDir,
	ext: '.ect'
}).render);
app.set('views', themeDir);

// route
app.use('/', (req, res, next) => {
	// view helper
	res.locals.asset = (file) => file + '?_=' + Date.now();

	// config
	res.locals.config = app.parent.get('config');
	// console.log(app.parent);
	console.log(res.locals.config);

	next();
});

app.get('/', (req, res, next) => {
	res.render('index');
});
