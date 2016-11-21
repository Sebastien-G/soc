var mongoose = require('mongoose');
var User = require('./user');
/*
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
*/
var messageSchema = new mongoose.Schema({
  fromUser : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUsers : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
/*  from: {
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
  tos: [tosSchema],*/
  owner_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  direction: {
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
  collection: 'messages'
});

module.exports = mongoose.model('Message', messageSchema);
