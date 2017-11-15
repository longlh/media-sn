module.exports = mongoose => {
	let schema = mongoose.Schema({
		name: {
			type: String,
		},
		slug: {
			type: String,
		},
		metaTitle: {
			type: String,
		},
		metaDescription: {
			type: String,
		},
	});

	return mongoose.model('Tag', schema);
};
