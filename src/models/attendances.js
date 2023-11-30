const { Schema, model } = require('mongoose');

const attendanceSchema = new Schema({
	staff: {
		type: String,
		required: true,
	},
	online: {
		type: Boolean,
		default: false,
	},
	time: {
		type: Number,
		default: 0,
	},
	lastCheck: {
		type: Number,
		default: null,
	},
	afkTime: {
		type: Number,
		default: 0,
	},
	afkStart: {
		type: Number,
		default: 0,
	},
});

module.exports = model('attendance', attendanceSchema);