const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
	chartName: {
		type: String,
		required: true,
	},
	chartType: {
		type: String,
	},
	createdBy: {
		type: String,
	},
	chartId: {
		type: String,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Chart = mongoose.model('chart', ChartSchema);
