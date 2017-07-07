const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/image-feed');

module.exports = {
	Media: require('./_media')
};
