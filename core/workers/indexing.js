const bluebird = require('bluebird');
const shortHash = require('shorthash')

function generateHash(value) {
  value = shortHash.unique(value)

  for (let i = value.length; i < 6; i++) {
    value = '_' + value
  }

  return value
}

module.exports = function(queue, shared, models, config, redis) {
  let Media = models.Media

  queue.process('indexing-all', (job, done) => {
    console.log(`indexing-all ${job.id}`)

    queue.create('indexing', {
      fromId: null
    }).save(() => done())

    done()
  })

  queue.process('indexing', (job, done) => {
    let { data } = job

    let query = {}
    let next = true

    if (data.id) {
      query['_id'] = data.id
      next = false
    }

    if (data.fromId) {
      query['_id'] = {
        '$gt': data.fromId
      }
    }

    Media.findOne(query).then(
      media => {
        if (!media) {
          console.log(`indexing done`)
          return done()
        }

        let timestamp = media._id.getTimestamp().valueOf()
        let counter = media._id.toString().substr(20, 4)
        let score = timestamp + parseInt(counter, 16)
        let hash = generateHash(media._id.toString())

        console.log(`indexing ${media._id}-${hash}`)

        Media
          .findOneAndUpdate({
            _id: media._id
          }, {
            hash: hash
          }, {
            new: true
          })
          .exec()
          .then(media => {
            redis
              .zadd('indexing:all', media.alias, media.hash)
              .then(() => {
                if (!next) {
                  return done()
                }

                queue
                  .create('indexing', {
                    fromId: media._id
                  })
                  .removeOnComplete(true)
                  .save(() => done())
              })

          })
      }
    )
  })

  return {
    total: function(tag = 'all') {
      return redis.zcard(`indexing:${tag}`)
    },
    siblings: function(hash, tag = 'all') {
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

          return {
            prev,
            next
          }
        })
    },
    pick: function(position, tag = 'all') {
      return redis
        .zrange(`indexing:${tag}`, position, position)
        .then(result => result[0])
    },
    pagination: function(page, pageSize, tag = 'all') {
      let min = (page - 1) * pageSize
      let max = page * pageSize - 1

      return redis
        .zrange(`indexing:${tag}`, min, max)
    },
    startIndex: function() {
      return new bluebird((resolve, reject) => {
        queue
          .create('indexing-all')
          .removeOnComplete(true)
          .save(() => resolve())
      })
    }
  }
}
