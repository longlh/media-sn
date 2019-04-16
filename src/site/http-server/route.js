import pathToRegexp from 'path-to-regexp'
import querystring from 'querystring'

import controllers from '@site/controllers'

const regexp = {}

export default async (server, theme) => {
  // TODO override by theme

  controllers.forEach(
    ({ name, path, methods }) => {
      console.log(`${name} -> ${path}`)

      if (regexp[name]) {
        throw `Duplicate ${name} registeration`
      }

      regexp[name] = pathToRegexp.compile(path)

      Object.entries(methods).forEach(
        ([ method, middlewares ]) => {
          if (typeof server[method] !== 'function') {
            throw 'Invalid configuration'
          }

          server[method](path, middlewares)
        }
      )
    }
  )

  // add view helper
  server.locals._ = server.locals._ || {}
  server.locals._.url = (name, pathParams, queryParams) => {
    const toPath = regexp[name]

    if (!toPath) {
      throw `${name} is not registered`
    }

    return toPath(pathParams) + queryParams ? '?' + querystring.stringify(queryParams) : ''
  }
}
