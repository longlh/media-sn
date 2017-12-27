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
app.set('views', themeDir + '/views')
app.engine('ect', ect({
  watch: true,
  root: themeDir + '/views',
  ext: '.ect'
}).render)

if (!config.production) {
  app.use('/css', express.static(path.resolve(themeDir, 'public/assets/css')))
  app.use('/img', express.static(path.resolve(themeDir, 'public/assets/img')))
  app.use('/js', express.static(path.resolve(themeDir, 'public/assets/js')))
}

app.use((req, res, next) => {
  // view helper
  res.locals.asset = file => {
    if (config.debug) {
      return file + '?_=' + Date.now()
    }

    return file
  }
  res.locals.upload = media => '/upload' + media.path
  // res.locals.settings = app.parent.get('shared').settings;

  // config
  res.locals.config = config
  res.locals.url = config.url + req.url

  next()
})

export default initRouter(app)
