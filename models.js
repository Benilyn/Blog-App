/* jshint esversion: 6 */

const uuid = require('uuid');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const blogPost = {
	
	create: function(title, content, author, publishDate) {
		const post = {
			id: uuid.v4(),
			title: title,
			content: content,
			author: author,
			publishDate: publishDate || Date.now()
		}; //const post
		this.posts.push(post);
		return post;
	}, //create: function
	
	get: function(id=null) {
		if (id !== null) {
			return this.posts.find(post => post.id === id);
		} //if (id=null)
		return this.posts.sort(function(a,b) {
			return b.publishDate - a.publishDate;
		}); //return this.posts.sort function 
	}, //get: function

	delete: function(id) {
		const postIndex = this.posts.findIndex(
			post => post.id === id);
		if (postIndex > -1) {
			this.posts.splice(postIndex, 1);
		} //if (postIndex > -1) 
	}, //delete: function

	update: function(updatedPost) {
		const {id} = updatedPost;
		const postIndex = this.posts.findIndex(
			post => post.id === updatedPost.id);
		if (postIndex === -1) {
			throw StorageException(
				`Can't update item, "${id}" doesn't exist.`); 
		} //if (postIndex === -1)
		this.posts[postIndex] = Object.assign(
			this.posts[postIndex], updatedPost);
		return this.posts[postIndex];
	} //update: function
}; //const blogPost


function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}


module.exports = {BlogPosts: createBlogPostsModel()};
