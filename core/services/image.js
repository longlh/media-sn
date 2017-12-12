import Bluebird from 'bluebird'
import gm from 'gm'
import gmBase64 from 'gm-base64'
import mkdirp from 'mkdirp'
import path from 'path'

export function getImageSize(filepath) {
  return new Bluebird((resolve, reject) => {
    gm(filepath).size((err, size) => {
      if (err) return reject(err)

      resolve(size)
    })
  })
}

export function generatePreview(filepath) {
  return new Bluebird((resolve, reject) => {
    gm(filepath).resize(20).noProfile()
      .toBase64('jpeg', true, (err, base64) => {
        if (err) return reject(err)

        resolve(base64)
      })
  })
}

export function optimizeImage(filepath, outpath) {
  const outDir = path.dirname(outpath)
  mkdirp.sync(outDir)

  return new Bluebird((resolve, reject) => {
    gm(filepath).quality(80).noProfile()
      .write(outpath, err => {
        if (err) return reject(err)

        resolve(outpath)
      })
  })
}
