var mongoose = require('mongoose');
var shortid = require('shortid');
var passportLocalMongoose = require('passport-local-mongoose');

// Start: FoF config
var fofOptions = {
    personModelName: 'User',
    friendshipModelName: 'Friendship',
    friendshipCollectionName: 'friendships'
};
var FriendsOfFriends = require('friends-of-friends')(mongoose, fofOptions);
// End: FoF config


var userSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true,
      default: shortid.generate,
      index: {
        unique: true
      }
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    confirmationDate: {
      type: Date,
      default: null
    },
    confirmationString: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      index: {
        unique: true,
        sparse: true
      }
    },
    role: {
      type: String,
      required: true,
      default: 'user'
    },
    username:  {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    about: {
      type: String,
      default: ''
    },
    dateOfBirth: Date,
    created: {
      type: Date,
      default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose,  {
  saltlen: 40
});

userSchema.plugin(FriendsOfFriends.plugin, fofOptions);

module.exports = mongoose.model(fofOptions.personModelName, userSchema);
