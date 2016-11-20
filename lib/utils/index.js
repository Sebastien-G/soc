var User = require('../../models/user');

var utils = {
  updateProfilePicInCollections: function (uid, profilePicId) {

  },

  getLeanFriend: function (user) {
    return {
      uid: user.uid,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePicId: user.profilePicId,
      profilePic: user.profilePi,
    };
  },

  getProfileUrl: function(uid) {
    return '/user/' + uid;
  },

  getProfilePic: function(user) {
    var filenameParts = user.profilePicId.split('.');
    var profilePicUid = filenameParts[0];
    var fileExt = filenameParts[1];
    user.profilePic = profilePicUid + '_50.' + fileExt;
    return profilePicUid;
  },

  getUserbyUid: function(uid, confirmed) {
    if (confirmed === undefined) {
      confirmed = true;
    }

    var query = User.findOne({
      confirmed: confirmed,
      uid: uid
    });

    return query.exec( function(err, user) {
      if (err) {
        //console.log(err);
        return false;
      } else {
        //console.log(user);
        return user;
      }
    }); // promise
  },

  getFriendshipStatus: function(reqUser, uid) {

    return new Promise(function(resolve, reject) {

      utils.getUserIdfromUid(uid).then(function(userId) {
        if (userId) {
          console.log('getFriendshipStatus userId: ' + userId);
          reqUser.getRelationship(userId, function (err, relationship) {
            if (err) {
              console.log('getRelationship err:');
              console.log(err);
              reject(err)
              //throw err;
            } else {
              console.log('getRelationship relationship: ' + relationship);
              resolve(relationship);
            }
          });
        }
      });

    }); // promise
  },

  getUserIdfromUid: function(uid, confirmed) {
    if (confirmed === undefined) {
      confirmed = true;
    }

    var query = User.findOne({
      confirmed: confirmed,
      uid: uid
    }).select({
      "_id": true
    });

    return query.exec( function(err, user) {
      if (err) {
        console.log('no match');
        return false;
      } else {
        console.log(user);
        return user._id;
      }
    }); // promise

  }, // getUserbyUid


  getFriends: function(reqUser, idsOnly) {
    return new Promise(function(resolve, reject) {

      idsOnly = (idsOnly === undefined) ? false : idsOnly;
      reqUser.getFriends(function (err, friends) {
        if (err) {
          reject(err);
          //throw err;
        } else {
          if (idsOnly) {
            var friendIds = [];
            friends.forEach(function (element) {
              friendIds.push(element._id);
            });

            resolve(friendIds);
          } else {
            resolve(friends);
          }
        }
      });

    }); // promise

  }, // getFriends

  getReceivedRequests: function(reqUser) {

    return new Promise(function(resolve, reject) {

      reqUser.getReceivedRequests(function (err, receivedRequests) {
        if (err) {
          console.log('getReceivedRequests err:');
          console.log(err);
          reject(err)
          //throw err;
        } else {
          console.log('getReceivedRequests receivedRequests:');
          console.log(receivedRequests);
          resolve(receivedRequests);
        }
      });

    }); // promise

  }, // getReceivedRequests

  getSentRequests: function(reqUser) {
    return new Promise(function(resolve, reject) {
      console.log('getSentRequests Promise');

      reqUser.getSentRequests(function (err, sentRequests) {
        if (err) {
          console.log('getSentRequests err:');
          console.log(err);
          reject(err);
          //throw err;
        } else {
          console.log('getSentRequests sentRequests:');
          console.log(sentRequests);
          resolve(sentRequests);
        }
      });

    }); // promise

  }, // getSentRequests

  getPendingFriends: function(reqUser) {

    return new Promise(function(resolve, reject) {

      reqUser.getPendingFriends(reqUser._id, function (err, pendingFriendIds) {
        if (err) {
          console.log('getPendingFriends err:');
          console.log(err);
          reject(err)
          //throw err;
        } else {
          // console.log('getPendingFriends pendingFriendIds:');
          // console.log(pendingFriendIds);
          resolve(pendingFriendIds);
        }
      });

    }); // promise

  } // getPendingFriends
};

module.exports = utils;
