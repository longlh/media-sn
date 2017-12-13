import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
})

export default mongoose.model('Tag', schema)
