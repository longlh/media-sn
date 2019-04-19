import { render } from '@core/middlewares'

import auth from './auth'
import home from './home'
import personal from './personal'

export default [
  ...auth,
  ...home,
  ...personal, {
  name: 'list',
  path: '/posts',
  methods: {
    get: [
      render('pages/list')
    ]
  }
}, {
  name: 'post',
  path: '/posts/:id',
  methods: {
    get: [
      render('pages/post')
    ]
  }
} ]
