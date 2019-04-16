import controllers from '@site/controllers'

const register = (server, controller) => {
  Object.entries(controller.methods).forEach(
    ([ method, middlewares ]) => {
      if (typeof server[method] !== 'function') {
        throw 'Invalid configuration'
      }

      server[method](controller.path, middlewares)
    }
  )
}

export default async (server, theme) => {
  // TODO override by theme

  controllers.forEach(
    (controller) => register(server, controller)
  )
}
