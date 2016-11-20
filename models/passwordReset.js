var mongoose = require('mongoose');

var passwordResetSchema = new mongoose.Schema({
  email:  {
    type: String,
    required: true
  },
  confirmationString: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  resetDate: {
    type: Date,
    default: null
  }
}, {
  collection: 'passwordReset'
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
