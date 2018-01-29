'use strict';

var got = require('got');
var publicIp = require('public-ip');
var pAny = require('p-any');
var pTimeout = require('p-timeout');

var defaults = {
	timeout: 5000,
	version: 'v4'
};

function appleCheck(options) {
	return got('http://captive.apple.com/hotspot-detect.html', {
		family: options.version === 'v4' ? 4 : 6,
		headers: { 'User-Agent': 'CaptiveNetworkSupport/1.0 wispr' }
	}).then(function (res) {
		return (/Success/.test(res.body || '') || Promise.reject()
		);
	});
}

module.exports = function (options) {
	options = Object.assign({}, defaults, options);

	var p = pAny([publicIp[options.version]().then(function () {
		return true;
	}), publicIp[options.version]({ https: true }).then(function () {
		return true;
	}), appleCheck(options)]);

	return pTimeout(p, options.timeout).catch(function () {
		return false;
	});
};
