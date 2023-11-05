const { Schema, model } = require('mongoose');

const resetSchema = new Schema({
	check: {
		type: Boolean,
		required: true,
	},
	channel: {
		type: String,
		required: true,
	},
});

module.exports = model('Reset', resetSchema);