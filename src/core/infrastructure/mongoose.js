import mongoose from 'mongoose'

import config from '@core/infrastructure/config'

mongoose.Promise = Promise
mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useCreateIndex: true
})

export default mongoose
