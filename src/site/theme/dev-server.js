import cors from 'cors'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'

export default async () => {
  const devServer = express()

  devServer.use((req, res, next) => {
    console.log('dev-server received...')

    res.sendStatus(404)
  })

  return devServer
}
