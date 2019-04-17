import path from 'path'

import config from '@core/infrastructure/config'
import override from '@theme/override'
import createDevServer from './dev-server'

const dynamicImport = (p) => {
  const module = require(p)

  return module.default || module
}

export default async ({ name, publicPath }) => {
  console.log(`Loading theme [${name}]... at: ${publicPath}`)

  const { cwd } = config
  const themeDir = path.join(cwd, 'themes', name)
  const outDir = path.join(cwd, '../data/dist')
  const manifestPath = path.join(outDir, 'manifest.json')

  const devServer = config.devMode ? await createDevServer({
    themeDir,
    outDir,
    manifestPath,
    publicPath
  }) : null

  return {
    devServer,
    manifestPath,
    themeDir,
    outDir,
    publicPath,
    override
  }
}
