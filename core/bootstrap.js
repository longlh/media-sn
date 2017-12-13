import Bluebird from 'bluebird'

import { remove as removeCache } from 'services/cache'

export default () => {
  return Bluebird.all([
    removeCache('setting')
  ])
}
