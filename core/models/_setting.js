module.exports = mongoose => {
	let schema = mongoose.Schema({
		key: {
			type: String,
			require: true,
			unique: true
		},
		value: {
			type: String
		}
	});

	return mongoose.model('Setting', schema);
};
