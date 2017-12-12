import bodyParser from 'body-parser'
import pick from 'object.pick'

import {
  load as loadSetting,
  update as updateSetting
} from 'services/setting'

export function render() {
  return [
    (req, res, next) => {
      loadSetting().then(setting => {
          res.locals.setting = setting

          next()
        })
    },
    (req, res, next) => res.render('setting')
  ]
}

export function update() {
  return [
    bodyParser.urlencoded({ extended: false }),
    (req, res, next) => {
      const setting = pick(req.body, ['page_title', 'ci_header', 'ci_footer'])

      updateSetting(setting).then(() => next())
    },
    (req, res, next) => res.redirect('/admin/setting')
  ]
}
