import User from '@core/schemas/user'

const authenticateByFacebook = async ({
  refreshToken,
  profile
}) => {
  const user = await User.findOne({
    'accounts.provider': 'facebook',
    'accounts.id': profile.id
  }).lean()

  if (user) {
    return user
  }

  const newUser = new User({
    accounts: [ {
      provider: 'facebook',
      id: profile.id,
      meta: {
        refreshToken,
        profile
      }
    } ]
  })

  await newUser.save()

  return newUser.toJSON()
}

const get = async (id) => {
  return User.findById(id).lean()
}

export default {
  authenticateByFacebook,
  get
}
