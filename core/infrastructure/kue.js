import kue from 'kue'

import config from 'infrastructure/config'

const options = {
  prefix: 'mf'
}

export default kue.createQueue({
  ...options,
  redis: config.redis
})

