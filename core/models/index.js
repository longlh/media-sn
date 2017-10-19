module.exports = (config) => {
	const mongoose = require('mongoose');

	mongoose.Promise = require('bluebird');
	mongoose.connect(config.db.url);

	return {
		Media: require('./_media')(mongoose),
		Setting: require('./_setting')(mongoose),
		MediaScore: require('./_media-score')(mongoose),
		VoteHistory: require('./_vote-history')(mongoose)
	};
};
