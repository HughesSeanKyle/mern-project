const mongoose = require('mongoose');
require('dotenv').config();

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const connectToMongo = async () => {
	try {
		// Connect to the MongoDB cluster
		await mongoose.connect(
			process.env.MONGO_DB_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			},
			() => console.log(' Mongoose is connected')
		);
	} catch (e) {
		console.log(`Database connection error: ${err.message}`);
	}
};

module.exports = connectToMongo;
