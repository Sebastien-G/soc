var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
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
    dateOfBirth: Date,
    created: {
      type: Date,
      default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose,  {
  saltlen: 40
});

module.exports = mongoose.model('User', userSchema);
