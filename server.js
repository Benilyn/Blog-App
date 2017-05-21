/* jshint esversion: 6 */

const bodyParser = require('body-parser');
const express    = require('express');
const mongoose	 = require('mongoose');
const app 		 = express();

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Post} = require('./mongoose-models');

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
  Post
  	.find()
  	.limit(10)
  	.exec()
  	.then(post => {
  		res.json({
  			post: post.map(
  				(post)=> post.apiRepr())	
  		}); //res.json
  	}) //.then(post)
  	.catch(
  		err => {
  			console.error(err);
  			res.status(500).json({message: 'Internal server error'});
  	}); //.cath
}); //app.get(/posts)

app.get('/posts/:id', (req, res) => {
	Post
		.findById(req.params.id)
		.exec()
		.then(post => res.json(post.apiRepr()))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});	
		}); //.catch
}); //app.get(/posts/:id)

app.post('/posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	Post
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			created: req.body.created
		}) //.create
		.then(
			post => res.status(201).json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		}); //.catch
}); //app.post

app.put('/posts/:id', (req, res) => {
	if (!(req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id` +
			`(${req.body.id}) must match`);
		console.error(message);
		res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['title', 'content', 'author'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	}); //updateableFields.forEach

	Post
		.findById(req.params.id)
		.exec()
		.then(post => res.json(post))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error'});
		}); //.catch
}); //app.put

app.delete('/posts/:id', (req, res) => {
  Post
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
}); //app.delete

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});



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