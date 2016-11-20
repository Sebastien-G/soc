exports = module.exports = function(io) {

  var debug = false;

  var app = require('../app');

  var socketNamespace = '/monitor';
  var monitorIoNs = io.of(socketNamespace); // http://socket.io/docs/rooms-and-namespaces/
  var utils = require('../lib/utils');
  var chalk = require('chalk');

  var connections = {};
  var rooms = {};
  var roomCount = 0;


  var getAllSockets = function () {
    // http://stackoverflow.com/a/38824928/1347953
    return Object.keys(io.sockets.connected);
  }

  var getSocketCount = function () {
    // http://stackoverflow.com/a/38824928/1347953
    return io.engine.clientsCount;
  }

  var getSockets = function (roomId, namespace) {
    /*
    http://stackoverflow.com/a/24145381/1347953
    + http://stackoverflow.com/a/35558508/1347953
    */
    var res = [];
    var ns = io.of(namespace || '/');

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          var index = ns.connected[id].rooms.valueOf(roomId);
          if(index !== -1) {
              res.push(ns.connected[id]);
          }
        } else {
          res.push(ns.connected[id]);
        }
      }
    }
    return res;
  }

  var socketIsAuthenticatedUser = function (socket) {
    if (socket.request && socket.request.user && socket.request.user.logged_in) {
      return socket.request.user.uid;
    }

    return false;
  }

  var getUidFromSocketId = function (socketId) {
  debug && console.log('funciton getUidFromSocketId(' + socketId + ')');
    var socketId;
    for (socketId in connections) {
      if (connections.hasOwnProperty(socketId)) {
        if (connections[socketId].user && connections[socketId].user.uid) {
          return connections[socketId].user.uid;
        }
      }
    }

    return false;
  }


  var getSocketIdFromUid = function (uid) {
    var socketId;
    for (socketId in connections) {
      if (connections.hasOwnProperty(socketId)) {
        if (connections[socketId].user && connections[socketId].user.uid) {
          if(connections[socketId].user.uid === uid) {
            return socketId;
          }
        }
      }
    }

    return false;
  }


  var getRedactedUser = function (socketId) {

    if (connections[socketId] && connections[socketId].user && connections[socketId].user.uid) {
      return {
        uid: connections[socketId].user.uid,
        firstname: connections[socketId].user.firstname,
        lastname: connections[socketId].user.lastname,
        profilePic: connections[socketId].user.profilePic
      }
    }

    return false;
  }


  monitorIoNs.on('connection', function(socket) {
    debug && console.log('ON:connection');
    debug && console.log('socket.id: ' + socket.id);

    var userConnection = {};
    if (socket.request && socket.request.user && socket.request.user.logged_in) {
      debug && console.log('~~User is authenticated');
      debug && console.log(socket.request.user);

      if (app && app.locals && app.locals.loggedInUsers) {
        // console.log('BEFORE:');
        // console.log(app.locals.loggedInUsers);
        var userConnection = {
          profilePic: socket.request.user.profilePic,
          firstname: socket.request.user.firstname,
          lastname: socket.request.user.lastname,
          uid: socket.request.user.uid,
          user_id: socket.request.user._id,
          loginDate: Date.now(),
        }

        //app.locals.loggedInUsers[userConnection.uid] = userConnection;
        // console.log('AFTER:');
        // console.log(app.locals.loggedInUsers);

      }
    } else {
      debug && console.log('~~User is NOT authenticated');
    }

    connections[socket.id] = {
      user: userConnection,
      socket: socket,
      socketId: socket.id,
      dateJoined: Date.now()
    }

    socket.on('disconnect', function() {
      debug && console.log('ON:disconnect connections:');
      debug && console.log(connections);
      if (connections.hasOwnProperty(socket.id)) {
/*
        var uid = getUidFromSocketId(socket.id);
        console.log('uid: ' + uid);
        if (uid) {
          console.log('uid exists, typeof: ' + typeof uid);
          if (app && app.locals && app.locals.loggedInUsers) {
            console.log('About to delete (here is app.locals.loggedInUsers):');
            console.log(app.locals.loggedInUsers);
            console.log('app.locals.loggedInUsers[uid] BEFORE delete:');
            console.log(app.locals.loggedInUsers[uid]);
            delete app.locals.loggedInUsers[uid];
            console.log('app.locals.loggedInUsers[uid] AFTER delete:');
            console.log(app.locals.loggedInUsers[uid]);
          }
        }
*/
        delete connections[socket.id];
        debug && console.log('User "' + socket.request.user.firstname + '" has been disconnected');
      }
    }); // socket.on('disconnect'


    socket.on('startChat', function(data) {
      // debug && console.log('ON:startChat');
      // debug && console.log('getSocketCount: ' + getSocketCount());
      // debug && console.log('connections count: ' + Object.keys(connections).length);
      // debug && console.log(data);
      if (socketIsAuthenticatedUser(socket)) {
        var toSocketId = getSocketIdFromUid(data.toUid);
        if (toSocketId) {
          var requesterUser = getRedactedUser(socket.id);
          connections[toSocketId].socket.emit('chatRequest', {
            fromUid: connections[toSocketId].user.uid,
            toUid: requesterUser.uid
          });
        } else {
          debug && console.log('toUser NOT found');
        }
      } else {
        debug && console.log('NOT From authenticated user');
      }
    }); // s


    socket.on('getChatUser', function(data) {
      debug && console.log('ON:getChatUser');
      debug && console.log(data);
      var user = getRedactedUser(socket.id);
      var toUserSocketId = getSocketIdFromUid(data.toUid);
      debug && console.log('toUserSocketId: ' + toUserSocketId);
      var toUser = getRedactedUser(toUserSocketId);
      debug && console.log('toUser: ', toUser);
      if (user) {
        socket.emit('chatUser', {
          user: user,
          toUser: toUser
        });
      }
    });

    socket.on('chatMessage', function(data) {
      var toSocketId = getSocketIdFromUid(data.toUid);
      if (toSocketId) {
        var fromUser = getRedactedUser(socket.id);

        connections[toSocketId].socket.emit('chatMessage', {
          fromUser: fromUser,
          message: data.message
        });
      }
    });




    monitorIoNs.emit('greetings', {
      message: "You are now connected through websocket " + socketNamespace + "."
    });

    socket.on('getActivityStatus', function(data) {
      // debug && console.log('On:getActivityStatus');
      // debug && console.log('getSocketCount: ' + getSocketCount());
      // debug && console.log('nb connections: ' + Object.keys(connections).length);


      var socketIds = Object.keys(io.of(socketNamespace).sockets);
      var nbOnlineUsers = socketIds.length;
      if (nbOnlineUsers > 0) {
        nbOnlineUsers--;
      }

      var nbLoggedIn = 0;
      if (app && app.locals && app.locals.loggedInUsers) {
        // console.log('app.locals.loggedInUsers');
        // console.log(app.locals.loggedInUsers);
        nbLoggedIn = Object.keys(app.locals.loggedInUsers).length || 0;
      }


      if (socket.request && socket.request.user && socket.request.user.logged_in) {

        utils.getFriends(socket.request.user).then(function(friends) {
          var onlineFriends = [];
          if (friends) {
            var userFriends = [];
            friends.forEach (function (user) {
              var userFriend = utils.getLeanFriend(user);
              var ss = utils.getProfilePic(userFriend);
              userFriends.push(userFriend);
            });

            // check which friends are online
            userFriends.forEach(function (element) {
              if (app.locals.loggedInUsers.hasOwnProperty(element.uid)) {
                onlineFriends.push(element);
              }
            });

          }

          socket.emit('activityStatus', {
            nbOnlineUsers: nbOnlineUsers,
            nbLoggedIn: nbLoggedIn,
            onlineFriends: onlineFriends
          });

        }); // utils.getFriends
      } else {
        socket.emit('activityStatus', {
          nbOnlineUsers: nbOnlineUsers,
          nbLoggedIn: nbLoggedIn,
          onlineFriends: []
        });
      }


    }); // getNbConnected








    socket.on('message', function(data) {
      if (data.message) {
        monitorIoNs.emit('messageAck', {
          status: 'success',
          originalMessage: data.message
        });
      } else {
        monitorIoNs.emit('messageAck', {
          status: 'failure',
          originalMessage: undefined
        });
      }
    });

  }); // monitorIoNs.on('connection'

};
