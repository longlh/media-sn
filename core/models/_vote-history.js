module.exports = mongoose => {
	const schema = mongoose.Schema({
		mediaId: {
			type: String,
			required: true,
		},
		score: {
			type: Number,
			required: true,
			default: 1,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	});

	return mongoose.model('VoteHistory', schema);
};
