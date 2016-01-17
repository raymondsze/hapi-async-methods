/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:11:21
*/

const _ = require('lodash');
const path = require('path');
const Schema = require('./schema');
const Promise = require('bluebird');
const importDirectory = require('import-directory');

// This plugin is used to make hapi support handler as async function
function register(server, options, next) {
	Schema.validate(options, function (error, config) {
		if (error) {
			next(error);
		} else {
			let methodsAsync = {};
			const dirs = config.methods;
			_.each(dirs, (dir) => {
				const relativePath = path.relative(__dirname, process.cwd() + '/' + dir);
				importDirectory(module, relativePath, {
					visit: function (obj) {
						if (!_.isUndefined(obj)) {
							let methods = _.isArray(obj) ? obj : [obj]; 
							_.each(methods, (method) => {
								if (_.isObject(method) && _.isFunction(method.method)) {
									const instance = _.clone(method);
									// store the oringial method
									const asyncMethod = method.method;
									// convert async function to normal thunky function
									instance.method = function (...args) {
										// the handler after function is called
										const after = args[args.length - 1];
										// call the async method, since asyn function return promise, use then and catch to handle result and error by handler
										asyncMethod.apply(this, args).then((result) => after(null, result)).catch((err) => after(err));
									};
									server.method(instance);
								}
							});
						}
					}
				});
			});
			_.each(server.methods, (method, name) => {
				methodsAsync[name] = function (...args) {
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
		}
	});
}

register.attributes = {
	pkg: require('../package.json')
};

module.exports = {
	register: register
};
