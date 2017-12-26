import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { extract as extractProfile } from 'services/oauth-profile'

import config from 'infrastructure/config'

passport.use(
  new GoogleStrategy({
    clientID: config.oauth.gg.clientId,
    clientSecret: config.oauth.gg.clientSecret,
    callbackURL: `${config.url}/admin/oauth/gg/callback`,
    scope: [ 'profile', 'email' ]
  },
  (accessToken, refreshToken, profile, cb) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value

    if (config.admins.includes(email)) {
      return cb(null, { email })
    }

    return cb(new Error('Invalid Credential'))
  })
)

passport.use(
  new FacebookStrategy({
    clientID: config.oauth.facebook.clientId,
    clientSecret: config.oauth.facebook.clientSecret,
    callbackURL: `${config.url}/auth/facebook/callback`,
    enableProof: true,
    scope: ['email'],
    profileFields: ['id', 'displayName', 'picture', 'email', 'link']
  }, (accessToken, refreshToken, profile, cb) => {
    return cb(null, extractProfile(profile, 'facebook'))
  })
)

passport.serializeUser((user, done) => done(null, user.email))
passport.deserializeUser((email, done) => done(null, { email }))

export default passport
