module.exports = mongoose => {
	const schema = mongoose.Schema({
		mediaId: {
			type: String,
			required: true,
			unique: true,
		},
		score: {
			type: Number,
			required: true,
			default: 1,
		},
	});

	return mongoose.model('MediaScore', schema);
};
