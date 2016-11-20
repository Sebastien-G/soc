var mongoose = require('mongoose');
var User = require('./user');

var tosSchema = new mongoose.Schema({
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
  }
});

var messageSchema = new mongoose.Schema({
  from: {
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
    }
  },
  tos: [tosSchema],
  content: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'messages'
});

module.exports = mongoose.model('Message', messageSchema);
