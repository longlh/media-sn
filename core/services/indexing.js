import Bluebird from 'bluebird'
import ms from 'ms'
import shortHash from 'shorthash'

import queue from 'infrastructure/kue'
import redis from 'infrastructure/redis'
import Media from 'models/media'
import { updateById as updateMediaById } from 'services/media'
import { getAll as getAllTags } from 'services/tag'

function generateHash(value) {
  value = shortHash.unique(value)

  for (let i = value.length; i < 6; i++) {
    value = '_' + value
  }

  return value
}

function updateTagIndex(media, tags = []) {
  const mediaTags = [...(media.tags || []), 'all']

  const promises = [...tags, 'all'].map(tag => {
    if (media.deleted) {
      return removeTagIndex(media, tag)
    }

    if (mediaTags.includes(tag)) {
      return addTagIndex(media, tag)
    }

    return removeTagIndex(media, tag)
  })

  return Bluebird.all(promises)
}

function removeTagIndex(media, tag = 'all') {
  return redis.zrem(`indexing:${tag}`, media.hash)
}

function addTagIndex(media, tag = 'all') {
  return redis.zadd(`indexing:${tag}`, media.alias, media.hash)
}

export function clearIndex() {
  return getAllTags().then(tags => {
    const allTags = [...tags, 'all']

    const promises = allTags.map(tag => {
      redis.del(`indexing:${tag}`)
    })

    return Bluebird.all(promises)
  })
}

export function startIndex(data) {
  return new Bluebird((resolve, reject) => {
    queue.create('indexing', data)
      .removeOnComplete(true)
      .ttl(ms('1h'))
      .save(() => resolve())
  })
}

export function index(media) {
  if (!media) return

  const hash = media.hash = generateHash(media._id.toString())

  console.log(`indexing... ${media._id}:${hash}`)

  const promises = [
    updateMediaById(media._id, { hash }),
    getAllTags()
  ]

  return Bluebird.all(promises)
    .spread((media, tags) => {
      return updateTagIndex(media, tags)
    }).then(() => (media))
}

export function countIndex(tag = 'all') {
  return redis.zcard(`indexing:${tag}`)
}

export function getRange(page, pageSize, tag = 'all', rev = true) {
  const min = (page - 1) * pageSize
  const max = page * pageSize - 1

  return rev ?
    redis.zrevrange(`indexing:${tag}`, min, max) :
    redis.zrange(`indexing:${tag}`, min, max)
}

export function getSiblings(hash, tag = 'all') {
  return redis.pipeline()
    .zcount(`indexing:${tag}`, `-inf`, `+inf`)
    .zrank(`indexing:${tag}`, hash)
    .exec()
    .then(results => {
      let total = results[0][1]
      let rank = results[1][1]

      let prevRank = rank - 1
      let nextRank = (rank + 1 >= total) ? 0 : (rank + 1)

      return redis.pipeline()
        .zrange(`indexing:${tag}`, prevRank, prevRank)
        .zrange(`indexing:${tag}`, nextRank, nextRank)
        .exec()
    })
    .then(results => {
      let prev = results[0][1][0]
      let next = results[1][1][0]

      return { prev, next }
    })
}
