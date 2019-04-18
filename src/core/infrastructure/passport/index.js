import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import userService from '@core/services/user'

import config from '@core/infrastructure/config'

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: 'http://localhost:3100/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile)

  try {
    const user = await userService.authenticateByFacebook({
      refreshToken,
      profile
    })

    console.log(user)

    done(null, user)
  } catch (e) {
    done(e)
  }
}))

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.get(id)

    done(null, user)
  } catch (e) {
    done(e)
  }
})

export default passport
