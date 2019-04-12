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

  if (theme.devServer) {
    const { devServer } = theme

    const [ port ] = await findPort(config.port + 1)
    const proxy = httpProxy.createProxyServer({})

    // forward /assets to devServer
    server.use(`${publicPath}`, [
      (req, res, next) => {
        proxy.web(req, res, {
          target: `http://0.0.0.0:${port}${publicPath}`
        })
      }
    ])

    server.on('started', () => {
      console.log(`Starting dev-server... at :${port}`)

      devServer.listen(port, () => {
        devServer.emit('started')
      })
    })
  }

  return server
}
