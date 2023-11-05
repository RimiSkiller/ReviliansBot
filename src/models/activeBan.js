const { Schema, model } = require('mongoose');

const activeBanSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
});

module.exports = model('ActiveBan', activeBanSchema);