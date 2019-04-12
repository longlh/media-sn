import express from 'express'
import morgan from 'morgan'

import config from '@/core/infrastructure/config'

const site = express()
const port = 3100

site.use(morgan('dev'))

site.listen(port, () => {
  console.log(`Started at ${port}`)
})
