const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});


const Post = mongoose.model('Post', postSchema, 'post');

module.exports = {Post};
