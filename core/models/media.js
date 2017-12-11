import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  alias: {
    type: Number,
    required: true,
    unique: true
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  preview: {
    type: String
  },
  hash: {
    type: String,
    index: true
  },
  deleted: {
    type: Boolean,
    default: false,
    index: true
  }
})

export default mongoose.model('Media', schema)
