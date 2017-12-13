import { load as loadSetting } from 'services/setting'

export default (req, res, next) => {
  loadSetting().then(setting => {
    res.locals.setting = setting

    next()
  })
}
