# media-feed
Fullstack JS opensource CMS to quickly develop a media feed system

## Environment
Install GM: https://github.com/aheckmann/gm

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
