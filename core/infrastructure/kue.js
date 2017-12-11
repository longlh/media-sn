import kue from 'kue'

import config from 'infrastructure/config'

export function createQueue(options) {
  return kue.creatQueue({
    ...options,
    redis: config.redis
  })
}
