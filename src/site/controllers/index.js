import render from '@core/middlewares/render'

import auth from './auth'
import home from './home'


export default [
  ...auth,
  ...home, {
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
