const { Schema, model } = require('mongoose');

const BestStaffSchema = new Schema({
	staff: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		default: 0,
	},
	mutes: {
		type: Number,
		default: 0,
	},
});

module.exports = model('BestStaff', BestStaffSchema);