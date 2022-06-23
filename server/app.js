const express = require('express');
const app = express();
mongoose = require('mongoose');
require('dotenv').config();

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const connectToMongo = async () => {
	try {
		// Connect to the MongoDB cluster
		await mongoose.connect(
			process.env.MONGO_DB_URI,
			{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
			() => console.log(' Mongoose is connected')
		);
	} catch (e) {
		console.log(`Database connection error: ${err.message}`);
	}
};

connectToMongo();

app.get('/', (req, res) => {
	res.send('Hello from the root route');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Serving from port ${PORT}.`);
});
