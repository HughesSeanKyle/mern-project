const express = require('express');
const app = express();
const connectToMongo = require('./config/db')();
const userRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const postRouter = require('./routes/api/post');
const profileRouter = require('./routes/api/profile');
const chartRouter = require('./routes/api/chart');

// console.log(chartRouter);

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
/*
	Reference this for restful route guide 
	- https://medium.com/@shubhangirajagrawal/the-7-restful-routes-a8e84201f206
*/
app.use(userRouter);
app.use(authRouter);
app.use(postRouter);
app.use(profileRouter);
app.use(chartRouter);

app.get('/', (req, res) => {
	res.send('Hello from the root route');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Serving from port ${PORT}.`);
});
