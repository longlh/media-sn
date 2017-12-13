function init(defaults = {}) {
  return function(req, res, next) {
    req._params ={ ...req._params, ...defaults }

    next()
  }
}

function handlerNotFound(e) {
  return (req, res, next) => next(e)
}

function getParamHandler(param) {
  try {
    const handler = require(`./params/${param}`)

    if (!handler) {
      throw new Error(`Handler for param ${param} is not found`)
    }

    return handler.default
  } catch(e) {
    return handlerNotFound(e)
  }
}

export default (defaults, ...params) => [
  init(defaults),
  ...(params.map(getParamHandler))
]
