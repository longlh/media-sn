import createDevServer from './dev-server'

export default async (theme) => {
  const devServer = await createDevServer(theme)

  return {
    devServer
  }
}
