import Media from 'models/media'

export function getMaxAlias() {
  return Media.findOne().sort('-alias').lean().exec()
    .then(media => {
      if (!media) return -1

      return media.alias
    })
}

export function create(data) {
  const media = new Media(data)

  return media.save()
}

export function getOneFrom(id) {
  return Media.findOne({
    _id: { '$gt': id }
  }).lean().exec()
}

export function getOne() {
  return Media.findOne().lean().exec()
}

export function get(id) {
  return Media.findById(id).lean().exec()
}

export function updateById(_id, data) {
  return Media
    .findOneAndUpdate({ _id  }, data, { new: true })
    .lean()
    .exec()
}
