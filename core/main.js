const express = require('express');
const container = module.exports = express();

// load modules
container.use('/api', require('./api'));
container.use('/admin', require('./admin'));
container.use('/', require('./app'));

// load config
container.set('config', {
	port: 3000
});
