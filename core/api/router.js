import { create as createMedia } from './controllers/media'

export default app => {
  app.post('/upload', createMedia())

  return app
}
