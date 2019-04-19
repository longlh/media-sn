import ect from 'ect'
import path from 'path'
import pretty from 'pretty'

import config from '@core/infrastructure/config'

export default async (server, { viewDir }) => {
  const engine = ect({
    watch: config.devMode,
    root: viewDir,
    ext: '.ect'
  })

  server.set('view engine', 'ect')
  server.set('views', viewDir)

  server.engine('ect', (filePath, options, done) => {
    engine.render(filePath, options, (error, html) => {
      if (error) {
        return done(error)
      }

      if (config.devMode) {
        return done(null, pretty(html, { ocd: true }))
      }

      // TODO minify html
      return done(null, html)
    })
  })

  return server
}
