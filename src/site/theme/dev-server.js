import cors from 'cors'
import express from 'express'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import webpack from 'webpack'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import webpackDevMiddleware from 'webpack-dev-middleware'

const createWebpackConfig = ({
  assets,
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
      home: [
        path.join(themeDir, 'pages/home/script/index.js'),
        path.join(themeDir, 'pages/home/style/index.scss')
      ],
      list: [
        path.join(themeDir, 'pages/list/script/index.js')
      ],
      personal: [
        path.join(themeDir, 'pages/personal/script/index.js')
      ]
    },
    plugins: [
      new WebpackAssetsManifest({
        output: manifestPath,
        publicPath: true,
        assets
      })
    ],
    module: {
      rules: [ {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      }, {
        test: /\.scss$/,
        use: [ {
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        } ]
      } ]
    }
  }
}

export default async (info) => {
  const assets = {}
  const webpackConfig = createWebpackConfig({
    ...info,
    assets
  })

  const compiler = webpack(webpackConfig)

  const devServer = express()

  compiler.hooks.emit.tap('done', () => {
    devServer.emit('compile:done', {
      assets
    })
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
