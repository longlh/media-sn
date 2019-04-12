import express from 'express'
import proxy from 'express-http-proxy'
import findPort from 'find-free-port'
import morgan from 'morgan'

import config from '@core/infrastructure/config'
import loadTheme from '@site/theme'

export default async () => {
  const server = express()

  // initialize
  server.use(morgan('dev'))

  // load theme
  const theme = await loadTheme(config.theme)

  if (theme.devServer) {
    const { devServer } = theme

    const [ port ] = await findPort(config.port + 1)

    // forward /assets to devServer
    server.use('/assets', proxy(`0.0.0.0:${port}`))

    server.on('started', () => {
      console.log(`Starting dev-server... at :${port}`)

      devServer.listen(port, () => {
        devServer.emit('started')
      })
    })
  }

  return server
}
