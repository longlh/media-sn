const express = require('express');
const kue = require('kue');

const env = process.env.NODE_ENV || 'dev';

const config = require('../config')[env];

if (!config) {
	throw new Error('Invalid environment [%s]', env);
}

const models = require('./models')(config);

const queue = kue.createQueue({
	prefix: 'if',
	redis: config.redis
});

const shared = {
	mediaCount: 0
};

const system = module.exports = express();

// load modules
system.use('/api', require('./api')(config));
system.use('/admin', require('./admin')(config));
system.use('/', require('./app')(config));

// init config
system.set('config', config);

// init models
system.set('models', models);

// init queue
system.set('queue', queue);

// init shared data
system.set('shared', shared);

// start worker
system.set('workers', {
	Media: require('./workers/media')(queue, shared, models, config),
	Setting: require('./workers/setting')(queue, shared, models, config)
});

