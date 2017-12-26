export function extract(profile, provider) {
  return {
    displayName: profile.displayName,
    avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
    _account: {
      uid: profile.id,
      provider: provider
    }
  };
}
