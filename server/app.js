const express = require('express');
const app = express();
const connectToMongo = require('./config/db')();
const userRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const postRouter = require('./routes/api/post');
const profileRouter = require('./routes/api/profile');
const chartRouter = require('./routes/api/chart');

// console.log(chartRouter);
const PORT = process.env.PORT || 5000;

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
/*
	Reference this for restful route guide 
	- https://medium.com/@shubhangirajagrawal/the-7-restful-routes-a8e84201f206
*/
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);
app.use('/chart', chartRouter);

app.get('/', (req, res) => {
	res.send('Hello from the root route');
});

if (
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'staging'
) {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + '/client/build/index.html'));
	});
}

app.listen(PORT, () => {
	console.log(`Serving from port ${PORT}.`);
});
