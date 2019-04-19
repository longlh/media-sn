import render from '@core/middlewares/render'

export default [ {
  name: 'personal',
  path: '/personal',
  methods: {
    get: [
      render('pages/personal')
    ]
  }
} ]
