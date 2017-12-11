function init(defaults = {}) {
  return function(req, res, next) {
    req._params = Object.assign({}, defaults);

    next();
  };
}

function handlerNotFound(e) {
  return function(req, res, next) {
    next(e);
  };
}

function getParamHandler(param) {
  try {
    const handler = require(`./params/${param}`);

    if (!handler) {
      throw new Error(`Handler for param ${param} is not found`);
    }

    return handler;
  } catch(e) {
    return handlerNotFound(e);
  }
}

function collect(defaults, ...params) {
  return [ init(defaults) ].concat(params.map(getParamHandler));
}

module.exports = {
  collect,
  init
};
