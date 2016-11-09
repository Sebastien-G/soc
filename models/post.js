var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var postSchema = new Schema({
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
    content: {
      type: String,
      required: true
    },
    publicationDate: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
