import Bluebird from 'bluebird'
import mongoose from 'mongoose'

import config from 'infrastructure/config'

mongoose.Promise = Bluebird
mongoose.connect(config.db.url, {
  useMongoClient: true
})

export default mongoose
