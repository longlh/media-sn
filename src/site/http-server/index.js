import express from 'express'
import httpProxy from 'http-proxy'
import findPort from 'find-free-port'
import morgan from 'morgan'

import config from '@core/infrastructure/config'
import passport from '@core/infrastructure/passport'
import loadTheme from '@site/theme'

import loadRoute from './route'
import loadViewEngine from './view-engine'

export default async () => {
  const server = express()

  // initialize
  server.use(morgan('dev'))
  server.use(passport.initialize())
  server.use(passport.session())

  // load theme
  const publicPath = '/assets/'
  const theme = await loadTheme({
    name: config.theme,
    publicPath
  })

  const [ internalPort ] = theme.devServer ?
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
    override: theme.override
  })
  await loadViewEngine(server, {
    viewDir: theme.themeDir
  })

  server.on('start', () => {
    if (!internalPort) {
      // TODO get assets from file

      return server.listen(config.port, () => {
        console.log(`Started standalone server at :${config.port}`)
      })
    }

    const { devServer } = theme

    devServer.on('compile:done', ({ assets }) => {
      // start server
      server.set('assets', assets)

      server.listen(config.port, () => {
        console.log(`Started server at :${config.port}`)
      })
    })

    // start dev-server
    devServer.listen(internalPort, () => {
      console.log(`Started dev-server at :${internalPort}`)
    })
  })

  return server
}
