const shortHash = require('shorthash')

function generateHash(value) {
  value = shortHash.unique(value)

  for (let i = value.length; i < 6; i++) {
    value = '_' + value
  }

  return value
}

module.exports = function(app) {
  app.get('/test/:hash', (req, res, next) => {
    let Indexing = app.parent.get('workers').Indexing

    Indexing
      .siblings(req.params.hash)
      .then(({ prev, next }) => {
        res.json({
          prev,
          next
        })
      })
  })


  app.get('/index', (req, res, next) => {
    let Media = app.parent.get('models').Media

    let queue = app.parent.get('queue');

    queue
      .create('indexing-all')
      .removeOnComplete(true)
      .save(() => res.send('ok'))
    // res.send('ok')
  })

  app.get('/test', (req, res, next) => {
    let total = req.app.parent.get('shared').mediaCount
    let cache = app.parent.get('shared').cache
    let Media = app.parent.get('models').Media

    let time = Date.now()

    Media.find()
      .limit(5)
      .sort('-alias')
      .exec()
      .then(media => {
        let _ids = media.map(m => {
          let timestamp = m._id.getTimestamp().valueOf()
          let counter = m._id.toString().substr(20, 4)
          let score = timestamp + parseInt(counter, 16)
          let legacyHash = generateHash(m.alias.toString())
          let hash = generateHash(score.toString())

          return {
            id: m._id,
            alias: m.alias,
            timestamp,
            counter,
            score,
            legacyHash,
            hash,
            humanDate: new Date(timestamp),
            humanScore: new Date(score)
          }
        })

        res.json(_ids)
      })
      .finally(() => {
        console.log('Takes ' + (Date.now() - time) + 'ms')
      })
  })
}
