# media-feed
Fullstack JS opensource CMS to quickly develop a media feed system

## Environment Guideline

- Ubuntu 16.04
- [Node 8](https://github.com/creationix/nvm)
- [MongoDB](https://docs.mongodb.com/v3.4/installation/)
- [Redis](https://www.rosehosting.com/blog/how-to-install-configure-and-use-redis-on-ubuntu-16-04/)
- [GM](https://gist.github.com/witooh/089eeac4165dfb5ccf3d)
- [Yarn](https://www.npmjs.com/package/yarn)

## Development
```
$ cp config.example.js config.dev.js
$ yarn
$ yarn start
```

## Production
```
$ cp config.example.js config.prod.js
$ yarn
$ yarn build
$ node core.legacy/index.js --CONFIG=config.prod.js &&
  node core.legacy/workers/indexing/index.js --CONFIG=config.prod.js &&
  node core.legacy/workers/media/index.js --CONFIG=config.prod.js
```

Or use [pm2](http://pm2.keymetrics.io/) to manage your processes
