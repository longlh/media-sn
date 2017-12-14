import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Tag', schema)
