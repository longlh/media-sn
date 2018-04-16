const path = require('path')

module.exports = {
  url: 'http://yourdomain.com',
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
    region: 'us-east-1',
    cname: 'yourcdndomain.net'
  },
  theme: 'default',
  oauth: {
    gg: {
      clientId: 'xxx',
      clientSecret: 'yyy',
    }
  },
  sitemap: {
    ttl: 600 * 1e3
  },
  debug: true,
  production: false,
  admins: ['admin1@yourdomain.com', 'admin2@yourdomain.com'],
  pageSize: 30,
  uploadDir: path.resolve(__dirname, 'content/upload')
}
