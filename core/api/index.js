import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

import queue from 'infrastructure/kue'

const uploadDir = path.resolve(
  __dirname,
  '../../content/upload'
)

const app = express()

app.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
      return next(err)
    }

    var basename = fields.name.toLowerCase()
    var storePath = path.resolve(uploadDir, basename)

    var chunk = parseInt(fields.chunk)
    var chunks = parseInt(fields.chunks)

    var rs = fs.createReadStream(files.file.path)
    var ws = fs.createWriteStream(storePath, {
      flags: 'a'
    })

    ws.on('close', err => {
      if (err) {
        console.log(err)
        return next(err)
      }

      fs.unlink(files.file.path)

      if (chunk < chunks - 1) {
        return res.sendStatus(200)
      }

      queue
        .create('media', {
          name: basename,
          path: storePath
        })
        .removeOnComplete(true)
        .save(() => {
          console.log('Notified worker')

          res.sendStatus(201)
        });
    });

    ws.on('error', error => {
      console.log(error)
      res.sendStatus(500)
    });

    rs.pipe(ws)
  })
})

export default app
