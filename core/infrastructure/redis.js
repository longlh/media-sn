import Redis from 'ioredis'

import config from 'infrastructure/config'

const redis = new Redis(config.redis)

export default redis
