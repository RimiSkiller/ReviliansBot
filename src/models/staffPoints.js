const { Schema, model } = require('mongoose');

const pointsSchema = new Schema({
	staff: {
		type: String,
		required: true,
	},
	points: {
		type: Number,
		default: 0,
	},
});

module.exports = model('staffpoint', pointsSchema);