module.exports = {
	production: {
		url: 'yourdomain.com',
		server: {
			port: 3000
		},
		redis: {
			port: 6379,
			host: 'localhost'
		},
		db: {
			url: 'mongodb://localhost/image-feed'
		},
		theme: 'default'
	},
	dev: {
		url: 'example.com:3000',
		server: {
			port: 3000
		},
		redis: {
			port: 6379,
			host: 'localhost'
		},
		db: {
			url: 'mongodb://localhost/image-feed'
		},
		theme: 'default'
	}
};
