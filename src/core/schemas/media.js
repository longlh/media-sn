import mongoose from '@core/infrastructure/mongoose'

const schema = mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true,
    default: 'local'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Media', schema)
