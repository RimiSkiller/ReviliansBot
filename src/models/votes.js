const { Schema, model } = require('mongoose');

const voteSchema = new Schema({
	message: {
		type: String,
		required: true,
	},
	channel: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
});

module.exports = model('Vote', voteSchema);