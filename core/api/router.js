import {
  create as createMedia,
  remove as removeMedia,
  restore as restoreMedia
} from './controllers/media'

export default app => {
  app.post('/upload', createMedia())
  app.post('/media/restore', restoreMedia())
  app.post('/media/remove', removeMedia())

  return app
}
