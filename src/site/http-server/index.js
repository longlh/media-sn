import express from 'express'
import httpProxy from 'http-proxy'
import findPort from 'find-free-port'
import morgan from 'morgan'

import config from '@core/infrastructure/config'
import loadTheme from '@site/theme'

export default async () => {
  const server = express()

  // initialize
  server.use(morgan('dev'))

  // load theme
  const publicPath = '/assets'
  const theme = await loadTheme({
    name: config.theme,
    publicPath
  })

  const [ internalPort ] = theme.devServer ?
    (await findPort(config.port + 1)) : null

  if (internalPort) {
    const proxy = httpProxy.createProxyServer({})

    // forward /assets to devServer
    server.use(`${publicPath}`, [
      (req, res, next) => {
        proxy.web(req, res, {
          target: `http://0.0.0.0:${internalPort}${publicPath}`
        })
      }
    ])
  }

  server.on('start', () => {
    if (!internalPort) {
      return server.listen(config.port, () => {
        console.log(`Started standalone server at :${config.port}`)
      })
    }

    const { devServer } = theme

    devServer.on('compile:done', () => {
      // start server
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
