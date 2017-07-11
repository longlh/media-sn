module.exports = {
	dev: {
		url: 'http://127.0.0.1:3000',
		server: {
			port: 3000
		},
		redis: {
			port: 6379,
			host: '127.0.0.1'
		},
		db: {
			url: 'mongodb://127.0.0.1/media-feed'
		},
		s3: {
			accessKeyId: 'xxx',
			secretAccessKey: 'yyy',
			bucket: 'zzz',
			region: 'us-east-1'
		},
		theme: 'default',
		oauth: {
			gg: {
				clientId: 'xxx',
				clientSecret: 'yyy',
			}
		}
	}
};
