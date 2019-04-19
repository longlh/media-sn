import render from '@core/middlewares/render'

export default [ {
  name: 'home',
  path: '/',
  methods: {
    get: [
      (req, res, next) => {
        if (req.user) {
          res.locals.authenticated = true
        }

        next()
      },
      render('pages/home')
    ]
  }
} ]
