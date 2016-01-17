/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-03 01:11:04
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:49:02
*/

export default [
	{
		name: 'sayHelloES6',
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
		name: 'sayByeES6',
		method: async function (name) {
			return 'Bye, ' + name;
		}
	}
];
