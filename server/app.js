const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
	res.send('Hello from the root route');
});

app.listen(PORT, () => {
	console.log(`Serving from port ${PORT}.`);
});
