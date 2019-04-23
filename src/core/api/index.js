import express from 'express'
import formidable from 'formidable'
import fs from 'fs-extra'
import path from 'path'

import config from '@core/infrastructure/config'
import mediaService from '@core/services/media'

export default async () => {
  const app = express()

  app.post('/upload', (req, res, next) => {
    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return next(err)
      }

      const storeDir = path.resolve(config.cwd, config.uploadDir)

      await fs.ensureDir(storeDir)

      const basename = fields.name.toLowerCase()
      const tmpPath = files.file.path
      const storePath = path.join(storeDir, fields.name)

      const chunk = parseInt(fields.chunk, 10)
      const chunks = parseInt(fields.chunks, 10)

      const rs = fs.createReadStream(tmpPath)
      const ws = fs.createWriteStream(storePath, { flags: 'a' })

      rs.on('end', async () => {
        await fs.remove(tmpPath)

        if (chunk < chunks - 1) {
          // accepted
          return res.sendStatus(202)
        }

        const media = await mediaService.create({
          path: storePath,
          createdBy: req.user._id
        })

        res.status(201).json(media)
      })

      rs.pipe(ws)
    })
  },
  (err, req, res, next) => {
    console.log(err)

    next()
  })

  return app
}
