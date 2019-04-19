import { render } from '@core/middlewares'

export default [ {
  name: 'home',
  path: '/',
  methods: {
    get: [
      render('pages/home')
    ]
  }
} ]
