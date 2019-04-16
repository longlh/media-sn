import ect from 'ect'
import path from 'path'

import config from '@core/infrastructure/config'

export default async (server, { viewDir }) => {
  const engine = ect({
    watch: config.devMode,
    root: viewDir,
    ext: '.ect'
  })

  server.set('view engine', 'ect')
  server.set('views', viewDir)
  server.engine('ect', engine.render)

  // set view helper
  server.locals._ = {}
  server.locals._.asset = (p) => {
    const assets = server.get('assets')

    return assets && assets[p] || p
  }

  return server
}
