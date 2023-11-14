const { Schema, model } = require('mongoose');

const tRolesSchema = new Schema({
	role: {
		type: String,
		required: true,
	},
	member: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
});

module.exports = model('temprole', tRolesSchema);