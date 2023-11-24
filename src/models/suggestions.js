const { Schema, model } = require('mongoose');

const suggestionsSchema = new Schema({
	author: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	up: {
		type: [String],
		default: [],
	},
	down: {
		type: [String],
		default: [],
	},
});

module.exports = model('Suggestions', suggestionsSchema);