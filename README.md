# media-feed
Single image per view, with prev + next + random navigator

## Environment
Install GM: https://github.com/aheckmann/gm

## Development
```
cp config.example.js config.dev.js
yarn
yarn start
```

## Production
```
cp config.example.js config.prod.js
yarn build
node core.legacy/index.js --CONFIG=config.prod.js &&
node core.legacy/workers/indexing/index.js --CONFIG=config.prod.js &&
node core.legacy/workers/media/index.js --CONFIG=config.prod.js
```

Or use `pm2` to manage your processes
