const { Schema, model } = require('mongoose');

const resetSchema = new Schema({
	reply: {
		type: String,
		required: true,
	},
	channel: {
		type: String,
		required: true,
	},
});

module.exports = model('Reset', resetSchema);