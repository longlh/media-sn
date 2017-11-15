module.exports = (config) => {
	const mongoose = require('mongoose');

	mongoose.Promise = require('bluebird');
	mongoose.connect(config.db.url);

	return {
		Media: require('./_media')(mongoose),
		Setting: require('./_setting')(mongoose),
		Tag: require('./_tag')(mongoose)
	};
};
