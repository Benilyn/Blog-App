/* jshint esversion: 6 */

const express 		= require('express');
const router 		= express.Router();

const bodyParser 	= require('body-parser');
const jsonParser 	= bodyParser.json();

const {BlogPosts}  	= require('./models');


BlogPosts.create (
	'Wisdom allows nothing to be good tht will not be so forever;' +
	'no man to be happy but he that needs no other happiness than what he has within himself;' +
	'no man to be great or powerful that is not master of himself.' +
	' - Lucius Annaeus Seneca'
	); //BlogPosts.create

BlogPosts.create (
	'I will govern my life and thoughts as if the whole world were to see the one and read the other,' +
	'for what dows it signify to make anything a secret to my neighbor,' +
	'when to God, who is the searcher of our hearts,' +
	'all our privacies are open?' +
	' - Lucius Annaeus Seneca'
	); //BlogPosts.create


router.get('/', (req, res) => {
  res.json(BlogPosts.get());
}); //router.get


router.post('/', jsonParser, (req, res) => {
	const requiredFields = [
		'title', 
		'content', 
		'author', 
		'publishDate'
	]; //const requiredFields

	for (let i=0; i<requiredFields.legth; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	const post = BlogPosts.create(
		req.body.title, 
		req.body.content, 
		req.body.author, 
		req.body.publishDate
	); //const post

	res.status(201).json(post);
}); //router.post


// DELETE blog post by id
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end();
}); //router.delete


// PUT blog post by id
router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = [
		'title', 
		'content', 
		'author', 
		'publishDate',
		'id'
	]; //const requiredFields

	for (let i=0; i<requiredFields.legth; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id "${req.params.id}" and request body id 
			${req.body.id} must match`
		); //const message

		console.error(message);
		return res.status(400).send(message);
	} //if (req.params.id !== req.body.id)

	console.log(`Updating blog post \`${req.params.id}\``);
	const updatedBlog = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		//publishDate: req.body.publishDate
	}); //const updatedBlog 
	
	res.status(200).json(updatedBlog);
}); //router.put

module.exports = router;



