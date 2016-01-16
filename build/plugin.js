'use strict';

/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-16 22:50:39
*/

const _ = require('lodash');
const Fs = require('fs');
const Schema = require('./schema');
const Promise = require('bluebird');

// This plugin is used to make hapi support handler as async function
function register(server, options, next) {
	Schema.validate(options, function (error, config) {
		if (error) {
			next(error);
		} else {
			let methodsAsync = {};
			const dirs = config.methods;
			const promises = _.map(dirs, dir => {
				return new Promise((resolve, reject) => {
					Fs.readdir(process.cwd() + '/' + dir, (err, fileList) => {
						if (err) {
							reject(err);
						} else {
							const methods = _.map(fileList, file => {
								const path = process.cwd() + '/' + dir + '/' + file;
								return require(path);
							});
							resolve(_.flatten(methods));
						}
					});
				});
			});
			Promise.all(promises).then(methods => {
				_.each(_.flatten(methods, true), method => {
					const instance = _.clone(method);
					// store the oringial method
					const asyncMethod = method.method;
					// convert async function to normal thunky function
					instance.method = function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						// the handler after function is called
						const after = args[args.length - 1];
						// call the async method, since asyn function return promise, use then and catch to handle result and error by handler
						asyncMethod.apply(this, args).then(result => after(null, result)).catch(err => after(error));
					};
					server.method(instance);
				});
				_.each(server.methods, (method, name) => {
					methodsAsync[name] = function () {
						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						// async function is a function return promise
						// convert back the async function
						return new Promise((resolve, reject) => {
							// call the thunky function
							server.methods[name].apply(server.methods, args.concat([(err, result) => {
								// reject if error exists, resolve if error not exists
								if (err) {
									reject(err);
								} else {
									resolve(result);
								}
							}]));
						});
					};
					// drop cache should also support async
					if (method.cache) {
						methodsAsync[name].cache = Promise.promisifyAll(method.cache);
					}
				});
				server.decorate('server', config.name, methodsAsync);
				next();
			}).catch(err => {
				next(err);
			});
		}
	});
}

register.attributes = {
	pkg: require('../package.json')
};

module.exports = {
	register: register
};
