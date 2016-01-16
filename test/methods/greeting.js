/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-03 01:11:04
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-16 22:35:40
*/

module.exports = [
	{
		name: 'sayHello',
		method: async function (name, gender) {
			return 'Hello World, ' + name + ', you are ' + gender;
		},
		options: {
			cache: {
				expiresIn: 7 * 24 * 60 * 1000,
				generateTimeout: 100
			},
			generateKey: function (name) {
				return name;
			}
		}
	},
	{
		name: 'sayBye',
		method: async function (name) {
			return 'Bye, ' + name;
		}
	}
];
