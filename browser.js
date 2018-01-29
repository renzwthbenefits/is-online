'use strict';

var publicIp = require('public-ip');

var defaults = {
	timeout: 5000,
	version: 'v4'
};

module.exports = function (options) {
	options = Object.assign({}, defaults, options);
	return publicIp[options.version](options).then(function () {
		return true;
	}).catch(function () {
		return false;
	});
};
