const aws = require('aws-sdk');
const bluebird = require('bluebird');
const fs = require('fs');
const mime = require('mime');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');

module.exports = function(queue, shared, models, config) {
	aws.config.update(config.s3);
	aws.config.setPromisesDependency(bluebird);

	const s3 = new aws.S3(config.s3);

	const host = config.s3.cname || `https://s3${config.s3.region === 'us-east-1' ? '' : `-${config.s3.region}`}.amazonaws.com/${config.s3.bucket}`;

	queue.process('media', function(job, done) {
		let contentType = mime.lookup(job.data.path);
		let onlineDir = createOnineDir();

		optimizeMedia(job.data.path, '.optimized')
			.then(optimizedPath => {
				return bluebird.all([
					uploadToS3(onlineDir + '/' + job.data.name, job.data.path, contentType),
					uploadToS3(onlineDir + '/optimized/' + job.data.name, optimizedPath, contentType)
				]);
			}, () => {
				return bluebird.all([
					uploadToS3(onlineDir + '/' + job.data.name, job.data.path, contentType)
				]);
			})
			.then(onlinePaths => {
				let originPath = onlinePaths[0];
				let optimizedPath = onlinePaths[1] || originPath;

				return new models.Media({
					path: optimizedPath,
					origin: originPath,
					storage: 'cloud',
					alias: shared.mediaCount + 1
				}).save();
			})
			.then(media => {
				shared.mediaCount = shared.mediaCount + 1;

				console.log('Upload completed, alias: ' + media.alias);
			})
			.finally(() => done());
	});

	countAliases();

	return {
		countAliases: countAliases
	};

	function createOnineDir() {
		let now = new Date();
		let year = now.getFullYear();
		let month = (now.getMonth() + 101).toString().substr(1, 2);

		return `${year}-${month}`;
	}

	function countAliases() {
		return models.Media.count({}).then(total => {
			shared.mediaCount = total;

			return total;
		});
	}

	function uploadToS3(name, localPath, contentType) {
		let s3Object = {
			Bucket: config.s3.bucket,
			Key: name,
			Body: fs.createReadStream(localPath),
			ContentType: contentType,
			// ContentDisposition: 'attachment; filename=' + job.data.name,
			CacheControl: `max-age=${30 * 24 * 60 * 60}`
		};

		return s3.putObject(s3Object)
			.promise()
			.then(result => {
				return `${host}/${name}`;
			})
			.finally(() => {
				fs.unlink(localPath);
			});
	}

	function optimizeMedia(localPath, outDir) {
		return new bluebird((resolve, reject) => {
			imagemin([
				localPath
			], outDir, {
				plugins: [
					imageminMozjpeg({
						quality: 80,
						progressive: true
					}),
					imageminPngquant({
						quality: '65-80'
					}),
					imageminGifsicle({
						interlaced: true,
						optimizationLevel: 3
					})
				]
			})
			.then(files => {
				if (!files[0] || !files[0].path) {
					return reject(new Error('imagemin failed'));
				}

				resolve(files[0].path);
			});
		});
	}
};
