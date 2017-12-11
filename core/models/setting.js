import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  key: {
    type: String,
    require: true,
    unique: true
  },
  value: {
    type: String
  }
})

export default mongoose.model('Setting', schema)
