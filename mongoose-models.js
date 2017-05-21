const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: {type: Date, default: Date.now}
});

postSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

postSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.created
  }; //return
}; //postSchema.methods.apiRepr

const Post = mongoose.model('Post', postSchema, 'post');

module.exports = {Post};
