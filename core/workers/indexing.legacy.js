'use strict';

var _kue = require('../core/infrastructure/kue');

var _kue2 = _interopRequireDefault(_kue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('worker:indexing');

console.log(_kue2.default);
