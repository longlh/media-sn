import path from 'path'

export default {
  cwd: path.resolve(__dirname, '..', '..'),
  // from ENV_VARIABLES
  devMode: process.env.NODE_ENV !== 'production',
  port: Number(process.env.PORT),
  theme: 'default',
  mongo: process.env.MONGO,
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: Number(process.env.REDIS_DB)
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  }
}
