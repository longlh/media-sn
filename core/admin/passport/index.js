const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = config => {
	passport.use(
		new GoogleStrategy({
			clientID: config.oauth.gg.clientId,
			clientSecret: config.oauth.gg.clientSecret,
			callbackURL: config.url + '/admin/oauth/gg/callback',
			scope: ['profile','email']
		},
		(accessToken, refreshToken, profile, cb) => {
			let email = profile.emails && profile.emails[0] && profile.emails[0].value;

			if (config.admins.includes(email)) {
				return cb(null, {
					email
				});
			}

			return cb(new Error('Invalid Credential'));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	passport.deserializeUser((email, done) => {
		done(null, {
			email
		});
	});

	return passport;
};
