import { redirectIfUnauthenticated } from 'middlewares/auth'

const authMiddleware = redirectIfUnauthenticated('/admin/login')

export default app => {
  app.get('/login', (req, res) => res.render('login'))

  app.get('/', authMiddleware, (req, res, next) => {
    res.sendStatus(200)
  })

  return app
}
