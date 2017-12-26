import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  displayName: String,
  uid: String,
  provider: String,
  password: String,
  roles: [{
    type: String
  }],
  email: {
    type: String,
    unique: true
  },
  avatar: {
    type: String
  },
  address: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('User', schema)
