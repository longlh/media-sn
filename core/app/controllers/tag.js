function listing() {
	return (req, res, next) => {
		const { app } = req;

		return app.parent.get('models').Tag
			.find()
			.then(tags => {
				res.locals.tags = tags;

				next();
			});
	};
}

module.exports = {
	listing
};
