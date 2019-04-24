import path from 'path'

import config from '@core/infrastructure/config'
import override from '@app/override'
import createDevServer from './dev-server'

export default async (publicPath) => {
  const { cwd } = config
  const appDir = path.join(cwd, './app')
  const outDir = path.join(cwd, '../data/dist')
  const manifestPath = path.join(outDir, 'manifest.json')

  const devServer = config.devMode ? await createDevServer({
    appDir,
    outDir,
    manifestPath,
    publicPath
  }) : null

  return {
    devServer,
    manifestPath,
    appDir,
    outDir,
    publicPath,
    override
  }
}
