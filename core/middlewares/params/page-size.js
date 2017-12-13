import config from 'infrastructure/config'

export default (req, res, next) => {
  req._params.pageSize = config.pageSize

  next()
}
