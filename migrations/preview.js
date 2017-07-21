const env = process.env.NODE_ENV || 'dev';

const bluebird = require('bluebird');
const fs = require('fs');
const gm = require('gm');
const path = require('path');
const progress = require('request-progress');
const request = require('request');

// inject plugin
require('gm-base64');

const config = require('../config')[env];

const models = require('../core/models')(config);

const DOWNLOAD_DIR = '/home/d/workspace/tmp';
const PREVIEW_DIR = '/home/d/workspace/tmp/preview';

models.Media
	.find({
		alias: 1
	})
	.exec()
	.then(media => {
		return media.reduce((p, m) => {
			return p.then(() => {
				return migrate(m);
			})
			.finally(() => console.log('Migrated media [%d]', m.alias));
		}, bluebird.resolve());
	});

function migrate(m) {
	return download(m)
		.then(() => {
			return getImageSize(m);
		})
		.then(size => {
			m.width = size.width;
			m.height = size.height;

			return generatePreview(m);
		})
		.then(base64content => {
			m.preview = base64content;

			return m.save();
		});
}

function generatePreview(m) {
	let basename = path.basename(m.path);
	let filepath = path.join(DOWNLOAD_DIR, basename);
	let output = path.join(PREVIEW_DIR, basename);

	return new bluebird((resolve, reject) => {
		gm(filepath)
			.resize(20)
			.noProfile()
			// .blur(7, 3)
			.toBase64('bmp', true, (err, base64) => {
				console.log(base64);

				if (err) {
					return reject(err);
				}

				resolve(base64);
			})
			// .write(output, (err) => {
			// 	if (err) {
			// 		return reject(err);
			// 	}

			// 	resolve();
			// });
	});
}

function getImageSize(m) {
	let basename = path.basename(m.path);
	let filepath = path.join(DOWNLOAD_DIR, basename);

	return new bluebird((resolve, reject) => {
		gm(filepath)
			.size((err, size) => {
				if (err) {
					return reject(err);
				}

				resolve(size);
			});
	});
}

function download(m) {
	let basename = path.basename(m.path);

	return new bluebird((resolve, reject) => {
		return resolve(m);

		progress(request(m.path, {
			throttle: 1e3
		}))
			.on('progress', (state) => {
				console.log('donwloaded %d %...', (state.percent * 100).toFixed(2));
			})
			.on('error', (err) => {
				reject(err);
			})
			.on('end', () => {
				resolve();
			})
			.pipe(fs.createWriteStream(path.join(DOWNLOAD_DIR, basename)));
	});
}
