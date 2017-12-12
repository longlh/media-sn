export default (req, res, next) => {
  const { page } = req.params

  req._params.currentPage = parseInt(page, 10)

  next()
}
