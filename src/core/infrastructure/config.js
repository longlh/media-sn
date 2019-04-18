import path from 'path'

export default {
  cwd: path.resolve(__dirname, '..', '..'),
  // from ENV_VARIABLES
  devMode: process.env.NODE_ENV !== 'production',
  mongo: process.env.MONGO,
  theme: 'default',
  port: Number(process.env.PORT),
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  }
}
