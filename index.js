import config from 'infrastructure/config'
import server from 'server'

const { port } = config.server

server.listen(port, () => console.log(`Started at ${port}`))
