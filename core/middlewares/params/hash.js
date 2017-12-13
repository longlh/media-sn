export default (req, res, next) => {
  req._params.hash = req.params.hash

  next()
}
