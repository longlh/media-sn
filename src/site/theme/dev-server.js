import cors from 'cors'
import express from 'express'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import webpack from 'webpack'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import webpackDevMiddleware from 'webpack-dev-middleware'

const createWebpackConfig = ({
  manifestPath,
  publicPath,
  themeDir,
  outDir
}) => {
  return {
    mode: 'development',
    output: {
      path: outDir,
      publicPath,
      filename: 'js/[name].[hash:6].js'
    },
    entry: {
      list: [
        path.join(themeDir, 'pages/list/script/index.js')
      ]
    },
    plugins: [
      new WebpackAssetsManifest({
        output: manifestPath,
        publicPath: `${publicPath}/`
      })
    ]
  }
}

export default async (info) => {
  const webpackConfig = createWebpackConfig(info)

  const compiler = webpack(webpackConfig)

  const devServer = express()

  compiler.hooks.emit.tap('done', () => {
    devServer.emit('compile:done')
  })

  devServer.use([
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      watchOption: {
        ignore: /node_modules/
      },
      writeToDisk: false,
      stats: 'minimal'
    })
  ])

  return devServer
}
