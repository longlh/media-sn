export default (req, res, next) => {
  req._params.tag = req.params.tag

  next()
}
