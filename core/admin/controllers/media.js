import { paging as pagingMedia } from 'services/media'

export function list() {
  return [
    (req, res, next) => {
      const { p = 1, t = 50 } = req.query

      if (p > 1) {
        res.locals.prevPage = parseInt(p, 10) - 1
      }

      res.locals.nextPage = parseInt(p, 10) + 1

      pagingMedia(parseInt(p, 10), parseInt(t, 10))
        .then(media => {
          res.locals.media = media


          next()
        })
        .catch(err => next(err))
    },
    (req, res, next) => res.render('media')
  ]
}
