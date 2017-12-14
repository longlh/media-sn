import bodyParser from 'body-parser'
import {
  create as createTag,
  purge as purgeTag,
  remove as removeTag,
  restore as restoreTag,
  update as updateTag,
  getAll as getAllTags
} from 'services/tag'

export function list() {
  return [
    (req, res, next) => {
      res.locals.showDeleted = !!req.query['deleted']

      getAllTags(res.locals.showDeleted).then(tags => {
        res.locals.tags = tags

        next()
      })
    },
    (req, res, next) => res.render('tag')
  ]
}

export function create() {
  return [
    bodyParser.urlencoded({ extended: false }),
    (req, res, next) => {
      const { name, slug, description } = req.body

      if (slug === 'all') return next(new Error('`all` is a reserved word'))

      createTag({ name, slug, description }).then(tag => {
        res.locals.tag = tag

        next()
      }).catch(next)
    },
    (req, res, next) => {
      const { showDeleted } = req.body

      if (showDeleted) {
        res.redirect('/admin/tags?deleted=true')
      } else {
        res.redirect('/admin/tags')
      }
    }
  ]
}

export function update() {
  return [
    bodyParser.urlencoded({ extended: false }),
    (req, res, next) => {
      const { name, description, action } = req.body
      const { slug } = req.params

      if (action === 'update') {
        updateTag(slug, { name, description }).finally(next)
      } else if (action === 'delete') {
        removeTag(slug).finally(next)
      } else if (action === 'restore') {
        restoreTag(slug).finally(next)
      } else if (action === 'purge') {
        purgeTag(slug).finally(next)
      } else {
        next()
      }
    },
    (req, res, next) => {
      const { showDeleted } = req.body

      if (showDeleted) {
        res.redirect('/admin/tags?deleted=true')
      } else {
        res.redirect('/admin/tags')
      }
    }
  ]
}
