import path from 'path'

// import config from '@theme/config'

import createDevServer from './dev-server'

export default async ({ name, publicPath }) => {
  console.log(`Loading theme [${name}]... at: ${publicPath}`)

  const cwd = process.cwd()
  const themeDir = path.join(cwd, 'content/themes', name)
  const outDir = path.join(cwd, 'data/dist')
  const manifestPath = path.join(outDir, 'manifest.json')

  const devServer = await createDevServer({
    themeDir,
    outDir,
    manifestPath,
    publicPath
  })

  const config = require(path.join(themeDir, 'config'))

  console.log(config)

  return {
    devServer,
    manifestPath,
    themeDir,
    outDir,
    publicPath
  }
}
