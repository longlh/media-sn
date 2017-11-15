const _ = require('lodash');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

module.exports = config => {
	const uploadDir = path.resolve(
		__dirname,
		'../../content/upload'
	);

	const app = express();

	app.use(bodyParser.json());

	app.post('/upload', (req, res, next) => {
		var form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err);
			}

			var basename = fields.name.toLowerCase();
			var storePath = path.resolve(uploadDir, basename);

			var chunk = parseInt(fields.chunk);
			var chunks = parseInt(fields.chunks);

			var rs = fs.createReadStream(files.file.path);
			var ws = fs.createWriteStream(storePath, {
				flags: 'a'
			});

			ws.on('close', error => {
				if (error) {
					console.log(error);
				}

				fs.unlink(files.file.path);

				if (chunk < chunks - 1) {
					return res.sendStatus(200);
				}

				app.parent
					.get('queue')
					.create('media', {
						name: basename,
						path: storePath
					})
					.removeOnComplete(true)
					.save(() => {
						console.log('Notified worker');

						res.sendStatus(201);
					});
			});

			ws.on('error', error => {
				console.log(error);
				res.sendStatus(500);
			});

			rs.pipe(ws);
		});
	});

	app.post('/media/tags', (req, res, next) => {
		const newTags = _.filter(req.body.tags, {
			isNew: true
		});
		const mediaTags = _.map(req.body.tags, 'name');

		return bluebird.all([
			app.parent.get('models').Media.update({
				alias: {
					$in: req.body.aliases
				}
			}, {
				$addToSet: {
					tags: { $each: mediaTags }
				}
			}, {
				multi: true
			}),
			app.parent.get('models').Tag.insertMany(newTags)
		])
		.then(() => res.status(201).json(null));
	});

	app.delete('/tags/:id', (req, res, next) => {
		app.parent.get('models').Tag.remove({
			_id: req.params.id
		}).then(() => res.status(200).end());
	});

	return app;
};
