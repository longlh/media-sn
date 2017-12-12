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
