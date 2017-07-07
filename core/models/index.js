const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/image-feed');

module.exports = {
	Media: require('./_media')
};
