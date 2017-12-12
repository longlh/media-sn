import ect from 'ect'
import express from 'express'
import path from 'path'
import random from 'random-int'

import config from 'infrastructure/config'

import initRouter from './router'

const app = express()

// setup view engine
const themeDir = path.resolve(__dirname, '../../content/themes', config.theme)
app.set('view engine', 'ect')
app.set('views', themeDir)
app.engine('ect', ect({
  watch: true,
  root: themeDir,
  ext: '.ect'
}).render)

export default initRouter(app)
