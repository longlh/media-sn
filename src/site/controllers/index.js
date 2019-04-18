import auth from './auth'

const render = (template) => (req, res) => res.render(template)

export default [
  ...auth, {
  name: 'home',
  path: '/',
  methods: {
    get: [
      async (req, res, next) => {
        console.log('[home] middleware 1')

        if (req.user) {
          console.log('authenticated with', req.user)
          res.locals.authenticated = true
        }

        next()
      },
      async (req, res, next) => {
        console.log('[home] middleware 2')

        next()
      },
      render('pages/home/view.ect')
    ]
  }
}, {
  name: 'list',
  path: '/posts',
  methods: {
    get: [
      async (req, res, next) => {
        console.log('[list] middleware 1')

        next()
      },
      render('pages/list/view.ect')
    ]
  }
}, {
  name: 'post',
  path: '/posts/:id',
  methods: {
    get: [
      render('pages/post/view.ect')
    ]
  }
} ]
