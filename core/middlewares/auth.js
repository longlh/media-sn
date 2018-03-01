import md5 from 'md5'

export function redirectIfUnauthenticated(redirectTo) {
  return (req, res, next) => {
    const { user } = req

    if (!user) return res.redirect(redirectTo)

    user.avatar = `//www.gravatar.com/avatar/${md5(req.user.email)}?d=identicon&f=y&s=36`
    res.locals.user = user
    next()
  }
}
