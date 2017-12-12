console.log('worker:media')

import Bluebird from 'bluebird'
import fs from 'fs'
import path from 'path'
import mime from 'mime'

import config from 'infrastructure/config'
import queue from 'infrastructure/kue'
import {
  getImageSize,
  generatePreview,
  optimizeImage
} from 'services/image'
import {
  createOnlineDir,
  upload
} from 'services/s3'
import {
  create as createMedia,
  getMaxAlias
} from 'services/media'

queue.process('media', (job, done) => {
  const contentType = mime.lookup(job.data.path)
  const basename = path.basename(job.data.path)
  const outPath = path.join(config.uploadDir, '.optimized', basename)
  const onlineDir = createOnlineDir()

  const promises = [
    getImageSize(job.data.path),
    generatePreview(job.data.path),
    upload(`${onlineDir}/${job.data.name}`, job.data.path, {
      contentType: contentType,
      expire: '1m'
    }).finally(() => {
      fs.unlinkSync(job.data.path)
    }),
    optimizeImage(job.data.path, outPath).then(optimizedPath => {
      return upload(`${onlineDir}/optimized/${job.data.name}`, optimizedPath, {
        contentType: contentType,
        expire: '1m'
      })
    }).finally(() => {
      fs.unlinkSync(outPath)
    }),
    getMaxAlias()
  ]

  Bluebird.all(promises)
    .spread((size, preview, origin, path, maxAlias) => {
      return createMedia({
        ...size,
        preview,
        origin,
        path,
        storage: 'cloud',
        alias: maxAlias + 1
      })
    }).finally(() => done())
    .catch(err => console.log(err))
})
