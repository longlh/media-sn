import passport from '@core/infrastructure/passport'

export default [ {
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
