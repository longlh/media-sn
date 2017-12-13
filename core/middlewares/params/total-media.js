import { countIndex } from 'services/indexing'

export default (req, res, next) => {
  countIndex().then(count => {
    req._params.totalMedia = count

    next()
  })
}
