const express = require('express');
const container = module.exports = express();

container.use('/api', require('./api'));
container.use('/admin', require('./admin'));
container.use('/', require('./app'));
