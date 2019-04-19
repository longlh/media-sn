import mongoose from 'mongoose'

import config from '@core/infrastructure/config'

mongoose.connect(config.mongo, {
  promiseLibrary: Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

export default mongoose
