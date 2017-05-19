/* jshint esversion: 6 */

const express    = require('express');
const router     = express.Router();
const morgan     = require('morgan');
const mongoose	 = require('mongoose');
const app 		 = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const blogPostsRouter = require('./blogPostsRouter');

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');



app.use(morgan('common'));
app.use(express.static('public'));
//app.use('/blog-post', blogPostsRouter);

app.get('/blog-post', (req, res) => {
  //res.send(BlogPosts);
  Restaurant
  	.find()
  	.limit(10)
  	.exec()
  	.then(blogPost => {
  		res.json({
  			blogPost: blogPost.map(
  				(blogPost) => blogPost.apiRepr())
  		}); //res.json
  	}) //.then(blogPost)
  	.catch(
  		err => {
  			console.error(err);
  			res.status(500).json({message: 'Internal server error'});
  	}); //.cath
}); //app.get(/blog-post)

app.get('/blog-post/:id', (req, res) => {
	Restaurant
		.findById(req.params.id)
		.exec()
		.then(blogPost => res.json(blogPost.apiRepr()))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});	
		}); //.catch
}); //app.get(/blog-post/:id)





let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on the port ${port}`);
				resolve();
			}) //server = app.listen
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			}); //.on(error)
		}); //mongoose.connect
	}); //return new Promise
} //runServer function

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			}); //server.close
		}); //return new Promise
	}); //return mongoose.disconnect
} //closeServer function 

if (require.main === module) {
  runServer().catch(err => console.error(err));
} //if (require.main === module)


module.exports = {app, runServer, closeServer};