const { Schema, model } = require('mongoose');

const checkSchema = new Schema({
	online: {
		type: Boolean,
		default: false,
	},
	staff: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		default: 0,
	},
});

module.exports = model('checkIn', checkSchema);