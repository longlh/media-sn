import Tag from 'models/tag'

export function getAll(showDeleted = false) {
  const condition = showDeleted ? {} : { deleted: false }

  return Tag.find(condition).lean().exec()
}

export function create(data) {
  const tag = new Tag(data)

  return tag.save()
}

export function update(slug, data) {
  return Tag.findOneAndUpdate({ slug }, data).exec()
}

export function remove(slug) {
  return Tag.findOneAndUpdate({ slug }, { deleted: true }).exec()
}

export function restore(slug) {
  return Tag.findOneAndUpdate({ slug }, { deleted: false }).exec()
}

export function purge(slug) {
  return Tag.findOneAndRemove({ slug }).exec()
}
