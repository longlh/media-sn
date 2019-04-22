import express from 'express'
import formidable from 'formidable'
import fs from 'fs-extra'
import path from 'path'

import config from '@core/infrastructure/config'

const buffers = {}

export default async () => {
  const app = express()

  app.post('/upload', (req, res, next) => {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) {
        return next(err)
      }

      const storeDir = path.resolve(config.cwd, '../content/upload')

      fs.ensureDirSync(storeDir)

      const basename = fields.name.toLowerCase()
      const tmpPath = files.file.path
      const storePath = path.join(storeDir, fields.name)

      const name = fields.name
      const chunk = parseInt(fields.chunk, 10)
      const chunks = parseInt(fields.chunks, 10)

      const rs = fs.createReadStream(tmpPath)

      rs.on('data', (chunk) => {
        fs.writeFile(storePath, chunk, { flag: 'a' })
      })

      rs.on('end', () => {
        fs.removeSync(tmpPath)

        if (chunk < chunks - 1) {
          return res.sendStatus(200)
        }

        res.sendStatus(201)
      })
    })
  },
  (err, req, res, next) => {
    console.log(err)

    next()
  })

  return app
}
