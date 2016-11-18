var mongoose = require('mongoose');
var User = require('./user');

var postSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    publicationDate: {
      type: Date,
      default: Date.now
    }
}, {
  collection: 'posts'
});

module.exports = mongoose.model('Post', postSchema);
