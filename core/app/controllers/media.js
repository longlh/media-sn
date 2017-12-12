import params from 'middlewares/params'

export function list() {
  return [
    params({ currentPage: 1 }, 'page-size', 'total-media'),
    (req, res, next) => {
      console.log(req._params)

      next()
    },
    (req, res, next) => res.sendStatus(200)
    // (req, res, next) => res.render('list')
  ]
}
