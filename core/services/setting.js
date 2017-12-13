import Bluebird from 'bluebird'
import Setting from 'models/setting'
import {
  get as cacheGet,
  set as cacheSet
} from 'services/cache'

function toSettingObject(records) {
  const setting = {}

  records.forEach(record => {
    setting[record.key] = record.value
  })

  return setting
}

export function load() {
  return cacheGet('setting').then(setting => {
      if (setting) {
        return setting
      }

      return Setting.find()
        .then(records => toSettingObject(records))
        .then(setting => {
          return Bluebird.all([
            setting,
            cacheSet('setting', setting)
          ])
        })
        .spread(setting => setting)
    })
}

export function update(setting) {
  const promises = Object.keys(setting).map(key => {
    return Setting.findOneAndUpdate({
      key
    }, {
      value: setting[key]
    }, {
      new: true,
      upsert: true
    }).exec()
  })

  return Bluebird.all(promises)
    .then(records => {
      const setting = toSettingObject(records)

      return cacheSet('setting', setting)
    })
}
