import createDevServer from './dev-server'

export default async (name) => {
  const devServer = await createDevServer()

  return {
    devServer
  }
}
