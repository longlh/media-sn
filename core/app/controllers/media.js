import random from 'random-int'

import { getRange, getSiblings, pick as pickIndex } from 'services/indexing'
import { getByHash, getByHashes } from 'services/media'

export function randomize() {
  return [
    (req, res, next) => {
      req._params.alias = random(req._params.totalMedia - 1)

      next()
    },
    ...findByAlias()
  ]
}

export function findByAlias() {
  return [
    (req, res, next) => {
      const { alias, totalMedia } = req._params

      const desiredAlias = alias === 0 ? totalMedia : (alias % totalMedia)

      pickIndex(desiredAlias)
        .then(hash => {
          res.locals.hash = hash

          next()
        })
    },
    (req, res, next) => {
      res.redirect(`/m/${res.locals.hash}`)
    }
  ]
}

export function single() {
  return [
    (req, res, next) => {
      const { hash } = req._params

      getByHash(hash)
        .then(media => {
          res.locals.media = media

          next()
        })
    },
    (req, res, next) => {
      const { hash } = req._params

      getSiblings(hash)
        .then(siblings => {
          res.locals.prev = `/m/${siblings.prev}`
          res.locals.next = `/m/${siblings.next}`

          next()
        })
    },
    (req, res, next) => res.render('media')
  ]
}

export function list() {
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
