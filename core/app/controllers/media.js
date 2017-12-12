import { getRange } from 'services/indexing'
import { getByHashes } from 'services/media'

export function list(defaults = {}) {
  return [
    (req, res, next) => {
      const { currentPage, pageSize, totalMedia, tag } = req._params

      const totalPage = Math.ceil(totalMedia / pageSize);

      if (currentPage > totalPage || currentPage < 1) {
        return res.redirect('/')
      }

      let nextPage = 0
      let prevPage = 0

      if (currentPage === 1) {
        nextPage = currentPage + 1
        prevPage = totalPage
      } else if (currentPage === totalPage) {
        prevPage = currentPage - 1
        nextPage = 1
      } else {
        nextPage = currentPage + 1
        prevPage = currentPage - 1
      }

      res.locals.next = (tag === 'all' ? `` : `/tags/${tag}`) + `/page/${nextPage}`
      res.locals.prev = (tag === 'all' ? `` : `/tags/${tag}`) + `/page/${prevPage}`

      next()
    },
    (req, res, next) => {
      const { currentPage, pageSize, tag } = req._params

      getRange(currentPage, pageSize, tag)
        .then(hashes => {
          console.log(hashes)

          res.locals.hashes = hashes

          next()
        })
    },
    (req, res, next) => {
      getByHashes(res.locals.hashes).then(media => {
        res.locals.media = media

        next()
      })
    },
    // (req, res, next) => res.sendStatus(200)
    (req, res, next) => res.render('list')
  ]
}
