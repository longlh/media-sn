export default (req, res, next) => {
  let { alias } = req.params

  req._params.alias = parseInt(alias, 10)

  next()
}

