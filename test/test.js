/*
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-01 02:43:46
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-16 22:41:05
*/

const server = require('./server');
const Lab = require('lab');
const Code = require('code');
const lab = Lab.script();
lab.experiment('async methods', function () {
	const pluginOptions = {
		name: 'asyncMethods',
		methods: ['./test/methods']
	};

	lab.test('register hapi-async-methods', (done) => {
		server.register({
			register: require('../build'),
			options: pluginOptions
		}, () => {
			server.start(() => {
				server.log(['info'], 'Server started at ' + server.info.uri);
				done();
			});
		});
	});
	lab.test('hello', (done) => {
		server.asyncMethods.sayHello('Raymond Sze', 'Male').then((result) => {
			Code.expect(result).to.equal('Hello World, Raymond Sze, you are Male');
			done();
		});
	});
	lab.test('hello-cache', (done) => {
		server.asyncMethods.sayHello('Raymond Sze', 'male').then((result) => {
			Code.expect(result).to.equal('Hello World, Raymond Sze, you are Male');
			done();
		});
	});
	lab.test('hello-drop-cache', (done) => {
		server.asyncMethods.sayHello.cache.dropAsync('Raymond Sze').then(() => {
			server.asyncMethods.sayHello('Raymond Sze', 'male').then((result) => {
				Code.expect(result).to.equal('Hello World, Raymond Sze, you are male');
				done();
			});
		});
	});
	lab.test('bye', (done) => {
		server.asyncMethods.sayBye('Raymond Sze').then((result) => {
			Code.expect(result).to.equal('Bye, Raymond Sze');
			done();
		});
	});
});

module.exports = lab;
