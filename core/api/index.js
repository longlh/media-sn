const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

const uploadDir = path.resolve(
	__dirname,
	'../../content/upload'
);

const app = module.exports = express();

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
					path: storePath.replace(uploadDir, ''),
					storage: 'local'
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
