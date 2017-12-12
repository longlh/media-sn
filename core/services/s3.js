import fs from 'fs'
import ms from 'ms'

import config from 'infrastructure/config'
import s3 from 'infrastructure/s3'

const host = config.s3.cname || `https://s3${config.s3.region === 'us-east-1' ? '' : `-${config.s3.region}`}.amazonaws.com/${config.s3.bucket}`;

export function upload(key, localPath, { contentType, expire }) {
  const s3Object = {
    Bucket: config.s3.bucket,
    Key: key,
    Body: fs.createReadStream(localPath),
    ContentType: contentType,
    CacheControl: `max-age=${ms(expire) / 1000}`
  }

  return s3.putObject(s3Object).promise()
    .then(() => `${host}/${key}`)
}

export function createOnlineDir() {
  let now = new Date()
  let year = now.getFullYear()
  let month = (now.getMonth() + 101).toString().substr(1, 2)

  return `${year}-${month}`
}
