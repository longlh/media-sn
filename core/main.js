const express = require('express');
const kue = require('kue');
const Redis = require('ioredis')

const env = process.env.NODE_ENV || 'dev';

const config = require('../config')[env];

if (!config) {
	throw new Error('Invalid environment [%s]', env);
}

const models = require('./models')(config);
const redis = new Redis({
	host: config.redis.host,
	port: config.redis.port
})
const queue = kue.createQueue({
	prefix: 'if',
	redis: config.redis
});

const shared = {
	purgeCache: Date.now(),
	mediaCount: 0,
	cache: {},
	settings: {}
};

const system = module.exports = express();

// log
if (config.debug) {
	system.use(require('morgan')('tiny'));
}

// remove slash trailing
system.use(require('connect-slashes')(false));

// load modules
system.use('/api', require('./api')(config));
system.use('/admin', require('./admin')(config));
system.use('/', require('./app')(config));

if (config.production) {
	// handle error
	system.use((error, req, res, next) => {
		res.sendStatus(500);
	});
}

// init config
system.set('config', config);

// init models
system.set('models', models);

// init queue
system.set('queue', queue);

// init shared data
system.set('shared', shared);

// init cache
system.set('redis', redis);

// start worker
system.set('workers', {
	Media: require('./workers/media')(queue, shared, models, config, redis),
	Setting: require('./workers/setting')(queue, shared, models, config, redis),
	Indexing: require('./workers/indexing')(queue, shared, models, config, redis)
});

