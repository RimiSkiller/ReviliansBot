const { Schema, model } = require('mongoose');

const mutesSchema = new Schema({
	staff: {
		type: String,
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

module.exports = model('mute', mutesSchema);