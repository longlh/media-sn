import config from '@core/infrastructure/config'
import createHttpServer from '@site/http-server'

const main = async () => {
  const server = await createHttpServer()

  server.listen(config.port, () => {
    server.emit('started')

    console.log(`Started at :${config.port}`)
  })
}

main()
