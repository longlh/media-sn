import controllers from '@site/controllers'

const register = (server, controller) => {
  Object.entries(controller.methods).forEach(
    ([ method, middlewares ]) => {
      switch (method) {
        case 'GET':
          server.get(controller.path, middlewares)

          break
      }
    }
  )
}

export default async (server, theme) => {
  // TODO override by theme

  controllers.forEach(
    (controller) => register(server, controller)
  )
}
