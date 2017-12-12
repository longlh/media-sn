import { list as listMedia } from './controllers/media'

export default app => {
  app.get('/', listMedia())

  return app
}
