import connectRedis from 'connect-redis'
import ect from 'ect'
import express from 'express'
import path from 'path'
import session from 'express-session'

import config from 'infrastructure/config'
import passport from 'infrastructure/passport'

import initRouter from './router'

const app = express()

// setup view engine
const viewDir = path.resolve(__dirname, 'views')
const assetDir = path.resolve(__dirname, 'public/assets')

if (!config.production) {
  app.use('/assets', express.static(assetDir))
}

app.set('view engine', 'ect')
app.set('views', viewDir)
app.engine('ect', ect({
  watch: true,
  root: viewDir,
  ext: '.ect'
}).render)

const RedisStore = connectRedis(session)

app.use(session({
  secret: 'xxx',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis. port
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/oauth/gg', passport.authenticate('google'))
app.get('/oauth/fb', passport.authenticate('facebook'))
app.get('/oauth/gg/callback', passport.authenticate('google', {
  failureRedirect: '/admin/login'
}), (req, res) => res.redirect('/admin'))
app.get('/oauth/fb/callback', passport.authenticate('facebook', {
  failureRedirect: '/admin/login'
}), (req, res) => res.redirect('/admin'))

export default initRouter(app)
