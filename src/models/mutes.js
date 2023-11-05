const { Schema, model } = require('mongoose');

const mutesSchema = new Schema({
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

module.exports = model('mute', mutesSchema);