import config from '@core/infrastructure/config'
import createHttpServer from '@site/http-server'

const main = async () => {
  const server = await createHttpServer()

  server.emit('start')
}

main()
