import path from 'path'

export default {
  cwd: path.resolve(__dirname, '..', '..'),
  // from ENV_VARIABLES
  devMode: process.env.NODE_ENV !== 'production',
  theme: 'default',
  port: Number(process.env.PORT)
}
