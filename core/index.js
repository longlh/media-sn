import bootstrap from 'bootstrap'
import server from 'server'
import config from 'infrastructure/config'

bootstrap().then(() => {
  const { port } = config.server

  server.listen(port, () => console.log(`Started at ${port}`))
})
