const express = require('express');
const app = express();
const connectToMongo = require('./config/db');

connectToMongo();

app.get('/', (req, res) => {
	res.send('Hello from the root route');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Serving from port ${PORT}.`);
});
