const express = require('express');
const ect = require('ect');
const path = require('path');

const themeName = 'default';
const themeDir = path.resolve(
	__dirname,
	'../../content/themes',
	themeName
);

const app = module.exports = express();

// config static dir
app.use(express.static(themeDir));

// config view engine
const renderer = ect({
	watch: true,
	root: themeDir,
	ext: '.ect'
});

app.set('view engine', 'ect');
app.engine('ect', renderer.render);
app.set('views', themeDir);

// route
app.use('/', (req, res, next) => {
	res.locals.asset = (file) => file;

	next();
});

app.get('/', (req, res, next) => {
	res.render('index');
});
