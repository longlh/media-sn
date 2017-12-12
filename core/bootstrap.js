import Bluebird from 'bluebird'

import { count as countMedia } from 'services/media'

export default () => {
  return Bluebird.all([
    countMedia()
  ])
}
