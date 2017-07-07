const express = require('express');
const ect = require('ect');
const path = require('path');

const viewDir = path.resolve(
	__dirname,
	'views'
);

const assetDir = path.resolve(
	__dirname,
	'../public/assets'
);

const app = module.exports = express();

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


app.get('/', (req, res, next) => {
	res.redirect(app.mountpath + '/upload');
});

app.get('/upload', (req, res, next) => {
	res.render('upload');
});
