import express from 'express'

import initRouter from './router'

const app = express()

export default initRouter(app)
