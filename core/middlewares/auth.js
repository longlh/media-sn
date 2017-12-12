export function redirectIfUnauthenticated(redirectTo) {
  return (req, res, next) => {
    if (!req.user) return res.redirect(redirectTo)

    res.locals.user = req.user
    next()
  }
}
