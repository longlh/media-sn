import Media from '@core/schemas/media'

const create = async (data) => {
  const media = new Media(data)

  await media.save()

  return media.toJSON()
}

export default {
  create
}
