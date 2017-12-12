import { get as cacheGet } from 'services/cache'

export default (req, res, next) => {
  cacheGet('total-media').then(count => {
    req._params.totalMedia = count

    next()
  })
}
