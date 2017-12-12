import { redirectIfUnauthenticated } from 'middlewares/auth'
import { systemInfo } from './controllers/dashboard'
import {
  render as renderSetting,
  update as updateSetting
} from './controllers/setting'

const requiresLogin = redirectIfUnauthenticated('/admin/login')

export default app => {
  app.get('/login', (req, res) => res.render('login'))

  app.get('/', requiresLogin, systemInfo())

  app.get('/upload', requiresLogin, (req, res) => res.render('upload'))

  app.route('/setting')
    .get(requiresLogin, renderSetting())
    .post(requiresLogin, updateSetting())

  return app
}
