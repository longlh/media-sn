import config from 'infrastructure/config'
import { getFrom as getMediaFrom } from 'services/media'

export function list() {
  return [
    (req, res, next) => {
      const { f, t = config.pageSize } = req.query

      getMediaFrom(f, parseInt(t, 10))
        .then(media => {
          res.locals.media = media
          res.locals.lastId = media.length > 0 ?
            media[media.length - 1]._id : null

          next()
        })
    },
    (req, res, next) => res.render('media')
  ]
}
