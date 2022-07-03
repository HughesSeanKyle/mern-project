const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	chartType: {
		type: String,
	},
	createdBy: {
		type: String,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Chart = mogoose.model('chart', ChartSchema);
