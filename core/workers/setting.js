const _ = require('lodash');
const bluebird = require('bluebird');

module.exports = function(queue, shared, models, config) {
	function load() {
		let settings = {};

		models.Setting.find().then(savedSettings => {
			savedSettings.forEach(setting => {
				settings[setting.key] = setting.value;
			});

			shared.settings = settings;
		});
	}

	function save(settings) {
		let promises = _.keys(settings).map(key => {
			return models.Setting.findOneAndUpdate({
				key: key
			}, {
				key: key,
				value: settings[key]
			}, {
				upsert: true
			}).exec();
		});

		return bluebird.all(promises)
			.then(() => {
				shared.settings = settings;
			});
	}

	load();

	return {
		save: save
	};
};
