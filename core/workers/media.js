module.exports = function(queue, shared, models, config) {
	models.Media.count({}).then(total => {
		shared.mediaCount = total;
	});

	queue.process('media', function(job, done) {
		let media = new models.Media({
			path: job.data.path,
			storage: job.data.storage,
			alias: shared.mediaCount
		});

		media
			.save()
			.then(media => {
				shared.mediaCount++;
			})
			.finally(() => done());
	});
};
