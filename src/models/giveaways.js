const { Schema, model } = require('mongoose');

const giveawaysSchema = new Schema({
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
	joins: {
		type: [String],
		default: [],
	},
	prize: {
		type: String,
		required: true,
	},
	winners: {
		type: Number,
		default: 1,
	},
});

module.exports = model('giveaway', giveawaysSchema);