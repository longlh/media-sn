import passport from '@core/infrastructure/passport'
import render from '@core/middlewares/render'

export default [ {
  name: 'auth.login',
  path: '/auth/login',
  methods: {
    get: [
      render('pages/login')
    ]
  }
}, {
  name: 'auth.logout',
  path: '/auth/logout',
  methods: {
    get: [
      (req, res) => {
        req.logout()

        res.redirect('/')
      }
    ]
  }
}, {
  name: 'auth.facebook',
  path: '/auth/facebook',
  methods: {
    get: [
      passport.authenticate('facebook')
    ]
  }
}, {
  name: 'auth.facebook.callback',
  path: '/auth/facebook/callback',
  methods: {
    get: [
      passport.authenticate('facebook', {
        failureRedirect: '/login'
      }),
      (req, res) => {
        console.log('login success', req.user)

        res.redirect('/')
      }
    ]
  }
} ]
