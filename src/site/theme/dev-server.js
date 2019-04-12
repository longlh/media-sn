import cors from 'cors'
import express from 'express'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'

const createWebpackConfig = ({ name, publicPath }) => {
  console.log(`Loading theme [${name}]... at: ${publicPath}`)

  const cwd = process.cwd()
  const themeDir = path.join(cwd, 'content/themes', name)
  const outDir = path.join(cwd, 'data/dist')

  console.log(themeDir, outDir)

  return {
    mode: 'development',
    output: {
      path: outDir,
      publicPath,
      filename: 'js/[name].js'
    },
    entry: {
      list: [
        path.join(themeDir, 'pages/list/script/index.js')
      ]
    }
  }
}

export default async (theme) => {
  const webpackConfig = createWebpackConfig(theme)
  const compiler = webpack(webpackConfig)

  const devServer = express()

  devServer.use([
    (req, res, next) => {
      console.log(`[dev-server] Handle ${req.url}...`)

      next()
    },
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      watchOption: {
        ignore: /node_modules/
      },
      writeToDisk: true
    })
  ])

  return devServer
}
