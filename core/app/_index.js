const express = require('express');
const ect = require('ect');
const path = require('path');
const random = require('random-int');

const params = require('../middlewares/params');

const media = require('./controllers/media');

module.exports = config => {
  const app = express();

  const themeName = 'default';
  const themeDir = path.resolve(
    __dirname,
    '../../content/themes',
    config.theme
  );
  const libDir = path.resolve(
    __dirname,
    '../../node_modules'
  );
  const uploadDir = path.resolve(
    __dirname,
    '../../content/upload'
  );

  // config static dir
  app.use(express.static(themeDir));
  app.use('/libs', express.static(libDir));
  app.use('/upload', express.static(uploadDir));

  // config view engine
  app.set('view engine', 'ect');
  app.set('views', themeDir);
  app.engine('ect', ect({
    watch: true,
    root: themeDir,
    ext: '.ect'
  }).render);

  // route
  app.use((req, res, next) => {
    // view helper
    res.locals.asset = file => {
      if (config.debug) {
        return file + '?_=' + Date.now();
      }

      return file + '?_=' + app.parent.get('shared').purgeCache;
    };
    res.locals.upload = media => '/upload' + media.path;
    res.locals.settings = app.parent.get('shared').settings;

    // config
    var config = res.locals.config = app.parent.get('config');
    res.locals.url = config.url + req.url;

    next();
  });

  app.get('/',
    params.collect({ currentPage: 1 },
      'page-size',
      'total-media'
    ),
    media.listing()
  );

  app.get('/page/:page([0-9]+)',
    params.collect({},
      'current-page',
      'page-size',
      'total-media'
    ),
    media.listing()
  );

  app.get('/random',
    params.collect({}, 'total-media'),
    (req, res, next) => {
      req._params.alias = random(req._params.totalMedia - 1)

      next()
    },
    media.legacySingle()
  );

  app.get('/:alias([0-9]+)',
    params.collect({},
      'alias',
      'total-media'
    ),
    media.legacySingle()
  );

  app.get('/m/:hash',
    params.collect({},
      'hash',
      'total-media'
    ),
    media.single()
  )

  app.get('*', (req, res, next) => {
    res.redirect('/');
  });

  return app;
};
