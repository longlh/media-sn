import Redis from 'ioredis'

import config from '@core/infrastructure/config'

export default new Redis(config.redis)
