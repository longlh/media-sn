import express from 'express'
import session from 'express-session'
import httpProxy from 'http-proxy'
import findPort from 'find-free-port'
import morgan from 'morgan'
import createRedisStore from 'connect-redis'

import createApiServer from '@core/api'
import config from '@core/infrastructure/config'
import passport from '@core/infrastructure/passport'
import redis from '@core/infrastructure/redis'
import loadApp from '@site/app'

import loadRoute from './route'
import loadViewEngine from './view-engine'

export default async () => {
  const server = express()
  const apiServer = await createApiServer()

  // initialize
  const RedisStore = createRedisStore(session)

  server.use(morgan('dev'))
  server.use(session({
    resave: false,
    secret: 'xxx',
    saveUninitialized: true,
    store: new RedisStore({
      client: redis
    })
  }))
  server.use(passport.initialize())
  server.use(passport.session())

  server.use('/api/v1', apiServer)

  // load theme
  const publicPath = '/assets/'
  const app = await loadApp(publicPath)

  const [ internalPort ] = app.devServer ?
    (await findPort(config.port + 1)) : [ null ]

  if (internalPort) {
    const proxy = httpProxy.createProxyServer({})

    // forward /assets to devServer
    server.use(publicPath, [
      (req, res, next) => {
        proxy.web(req, res, {
          target: `http://0.0.0.0:${internalPort}${publicPath}`
        })
      }
    ])
  }

  // set view helper
  server.locals._ = server.locals._ || {}
  server.locals._.asset = (p) => {
    const assets = server.get('assets')

    return assets && assets[p] || p
  }

  // bootstrap
  await loadRoute(server, {
    override: app.override
  })
  await loadViewEngine(server, {
    viewDir: app.appDir
  })

  server.on('start', () => {
    if (!internalPort) {
      // TODO get assets from file

      return server.listen(config.port, () => {
        console.log(`Started standalone server at :${config.port}`)
      })
    }

    const { devServer } = app

    devServer.once('compile:done', () => {
      server.listen(config.port, () => {
        console.log(`Started server at :${config.port}`)
      })
    })

    devServer.on('compile:done', ({ assets }) => {
      // start server
      server.set('assets', assets)
    })

    // start dev-server
    devServer.listen(internalPort, () => {
      console.log(`Started dev-server at :${internalPort}`)
    })
  })

  return server
}
