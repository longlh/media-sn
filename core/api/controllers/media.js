import formidable from 'formidable'
import fs from 'fs'
import ms from 'ms'
import path from 'path'

import config from 'infrastructure/config'
import queue from 'infrastructure/kue'

export function create() {
  return [
    (req, res, next) => {
      const form = new formidable.IncomingForm()

      form.parse(req, (err, fields, files) => {
        if (err) return next(err)

        const basename = fields.name.toLowerCase()
        const storePath = path.resolve(config.uploadDir, basename)
        const tempPath = files.file.path

        const chunk = parseInt(fields.chunk, 10)
        const chunks = parseInt(fields.chunks, 10)

        const rs = fs.createReadStream(tempPath)
        const ws = fs.createWriteStream(storePath, { flags: 'a' })

        ws.on('close', err => {
          if (err) return next(err)

          fs.unlinkSync(tempPath)

          if (chunk < chunks - 1) {
            return res.sendStatus(200)
          }

          queue.create('media', {
            name: basename,
            path: storePath
          })
          .removeOnComplete(true)
          .ttl(ms('1h'))
          .save(() => res.sendStatus(201))
        })

        ws.on('error', err => next(err))

        rs.pipe(ws)
      })
    },
    (error, req, res, next) => res.sendStatus(500)
  ]
}
