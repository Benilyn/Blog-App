/* jshint esversion: 6 */

const express    = require('express');
const router     = express.Router();
const morgan     = require('morgan');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app        = express();

const blogPostsRouter = require('./blogPostsRouter');


app.use(morgan('common'));
app.use(express.static('public'));
app.use('/blog-post', blogPostsRouter);

app.get('/', (req, res) => {
  res.send(BlogPosts);
});

let server;

function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log('Your app is listening on the ${port}');
			resolve(server);
		}) //server
		.on('error', err => {
			reject(err);
		}); //.on(error)
	}); //return new Promise
} //function runServer

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			} //if(err)
			resolve();
		}); //server.close(err)
	}); //return new Promise
} //function closeServer

if (require.main === module) {
  runServer().catch(err => console.error(err));
} //if (require.main === module)


module.exports = {app, runServer, closeServer};