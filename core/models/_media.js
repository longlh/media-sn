const mongoose = require('mongoose');

const schema = mongoose.Schema({
	path: {
		type: String,
		required: true
	},
	storage: {
		type: String,
		required: true
	},
	alias: {
		type: Number,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('Media', schema);
