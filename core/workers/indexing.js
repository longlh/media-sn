const shortHash = require('shorthash')

function generateHash(value) {
  value = shortHash.unique(value)

  for (let i = value.length; i < 6; i++) {
    value = '_' + value
  }

  return value
}

module.exports = function(queue, shared, models, config) {
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
      }
    )
  })
}
