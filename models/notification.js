var mongoose = require('mongoose');
var User = require('./user');
/*
Types:
receivedFriendRequest
acceptedFriendRequest
rejectedFriendRequest
newMessage
chatRequest
*/
var notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
/*  uid: {
    type: String,
    required: true
  },*/
  type: {
    type: String,
    required: true
  },
  unread: {
    type: Boolean,
    default: true
  },
  readDate: {
    type: Date,
    default: null
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'notifications'
});

module.exports = mongoose.model('Notification', notificationSchema);
