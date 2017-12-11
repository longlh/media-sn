import { redirectIfUnauthenticated } from 'middlewares/auth'
import { systemInfo } from './controllers/dashboard'

const requiresLogin = redirectIfUnauthenticated('/admin/login')

export default app => {
  app.get('/login', (req, res) => res.render('login'))

  app.get('/', requiresLogin, systemInfo())

  app.get('/upload', requiresLogin, (req, res) => res.render('upload'))

  return app
}
