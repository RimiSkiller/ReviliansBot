const { Schema, model } = require('mongoose');

const bansSchema = new Schema({
	number: {
		type: Number,
		required: true,
	},
	member: {
		type: String,
		required: true,
	},
	embed: {
		type: Object,
		required: true,
	},
});

module.exports = model('ban', bansSchema);