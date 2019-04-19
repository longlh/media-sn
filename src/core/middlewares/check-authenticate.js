export default (req, res, next) => {
  res.locals.authenticated = !!req.user

  next()
}
