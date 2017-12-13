console.log('worker:indexing')

import queue from 'infrastructure/kue'
import { index as indexMedia, startIndex } from 'services/indexing'
import { get, getOne, getOneFrom } from 'services/media'

queue.process('indexing-all', (job, done) => {

})

queue.process('indexing', (job, done) => {
  const { data } = job
  const isContinue = !data.id

  const getMediaJob = data.id ? get(data.id) : (data.from ? getOneFrom(data.from) : getOne())

  // (
  //   data.id ? get(data.id) :
  //     (data.from ? getOneFrom(data.from) :
  //       getOne())
  // ).then(media => {
  //   console.log(media)


  // }).finally(() => done())

  getMediaJob
    .then(media => indexMedia(media))
    .then(media => {
      if (!isContinue) return

      if (!media) return

      return startIndex({
        from: media._id
      })
    })
    .finally(() => {
      done()
    })
})
