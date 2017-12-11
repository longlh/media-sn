import Redis from 'ioredis'

import config from 'infrastructure/mongoose'

const { host, port } = config.redis

const redis = new Redis({ host, port })

export default redis
