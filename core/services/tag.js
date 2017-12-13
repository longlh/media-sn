import Tag from 'models/tag'

export function getAll() {
  return Tag.find().lean().exec()
}
