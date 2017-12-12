import _ from 'lodash'
import { get as cacheGet } from 'services/cache'
import { startIndex, clearIndex, countIndex } from 'services/indexing'

function purgeMemCache() {
  return [
    (req, res, next) => {
      let { app } = req

      app.parent.get('shared').cache = {};
      app.parent.get('shared').purgeCache = Date.now();
      app.parent.get('workers').Media
        .countMedia()
        .then(() => next());
    },
    (req, res, next) => res.redirect('/admin')
  ]
}

export function reIndex() {
  return [
    (req, res, next) => {
      clearIndex().then(() => next())
    },
    (req, res, next) => {
      startIndex().then(() => next())
    },
    (req, res, next) => res.redirect('/admin')
  ]
}

export function systemInfo() {
  return [
    // (req, res, next) => {
    //   const cache = req.app.parent.get('shared').cache

    //   res.locals.mediaInMemCache = _.keys(cache).length

    //   next()
    // },
    (req, res, next) => {
      countIndex().then(count => {
        res.locals.indexedMedia = count
        next()
      })
    },
    // (req, res, next) => {
    //   const Indexing = req.app.parent.get('workers').Indexing

    //   Indexing
    //     .total()
    //     .then(total => {
    //       res.locals.indexedMedia = total

    //       next()
    //     })
    // },
    (req, res, next) => {
      res.render('dashboard')
    }
  ]
}
