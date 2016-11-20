var mongoose = require('mongoose');
var User = require('./user');
/*
Types:
friendRequest
acceptedFriendRequest
newMessage
chatRequest
*/
var notificationSchema = new mongoose.Schema({
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
    default: Date.now
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'notifications'
});

module.exports = mongoose.model('Notification', notificationSchema);
