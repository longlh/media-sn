import namor from 'namor'
import titleCase from 'title-case'

import mongoose from '@core/infrastructure/mongoose'

const account = mongoose.Schema({
  provider: {
    type: String,
    required: true,
    default: 'local'
  },
  id: {
    type: String,
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  _id: false
})

const user = mongoose.Schema({
  accounts: [ account ],
  displayName: {
    type: String,
    required: true,
    default: () => titleCase(
      namor.generate({
        manly: true,
        words: 2,
        numbers: 0
      }).replace(/-/g, ' ')
    )
  }
}, {
  timestamps: true
})

// create index
user.index({
  'accounts.provider': 1,
  'accounts.id': 1
}, {
  unique: true
})

export default mongoose.model('User', user)
