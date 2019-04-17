import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import config from '@core/infrastructure/config'

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: 'http://localhost:3100/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile)

  done(null, profile)
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => done(null, {
  id
}))

export default passport
