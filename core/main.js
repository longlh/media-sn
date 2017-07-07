const express = require('express');
const kue = require('kue');

const container = module.exports = express();

const queue = kue.createQueue({
	prefix: 'if',
	redis: {
		port: 6379,
		host: '127.0.0.1'
	}
});

const config = {
	port: 3000
};

const shared = {
	mediaCount: 0
};

const models = require('./models');

// load modules
container.use('/api', require('./api'));
container.use('/admin', require('./admin'));
container.use('/', require('./app'));

// init config
container.set('config', config);

// init models
container.set('models', models);

// init queue
container.set('queue', queue);

// init shared data
container.set('shared', shared);

// start worker

require('./workers/media')(queue, shared, models, config);
