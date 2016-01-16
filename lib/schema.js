/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-03 21:52:13
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-16 21:57:51
*/

const Joi = require('joi');

module.exports = Joi.object({
	name: Joi.string().default('methodsAsync').optional(),
	methods: Joi.array().items(Joi.string()).default([]).optional()
});
