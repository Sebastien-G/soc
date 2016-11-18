exports = module.exports = function(io) {

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

  var findUidinConnections = function (uid) {
    var socketId;
    for (socketId in connections) {
      if (connections.hasOwnProperty(socketId)) {
        if (connections[socketId].user.uid) {
          if(connections[socketId].user.uid === uid) {
            return socketId;
          }
        }
      }
    }

    return false;
  }


  var getRedactedUser = function (socketId) {

    if (connections[socketId].user.uid) {
      return {
        uid: connections[socketId].user.uid,
        firstname: connections[socketId].user.firstname,
        lastname: connections[socketId].user.lastname,
        profilePic: connections[socketId].user.profilePic
      }
    }

    return false;
  }

  // var getSocketsinRoom = function (roomId) {
  //   /*
  //   http://stackoverflow.com/a/24145381/1347953
  //   */
  //   var res = [];
  //   var room = io.sockets.adapter.rooms[roomId];
  //   console.log('getSocketsinRoom room: ' + room);
  //   if (room) {
  //     for (var id in room) {
  //       res.push(io.sockets.adapter.nsp.connected[id]);
  //     }
  //   }
  //   return res;
  // };

  monitorIoNs.on('connection', function(socket) {

    console.log(socket.id);

    var user;
    if (socket.request && socket.request.user) {
      user = socket.request.user;
    } else {
      user = {};
    }

    connections[socket.id] = {
      user: user,
      socket: socket,
      socketId: socket.id,
      dateJoined: Date.now()
    }

    console.log('getSocketCount: ' + getSocketCount());
    //console.log(getAllSockets());
    //console.log(getSockets());

    // console.log('NEW Connection ♥ ♥ ♥');
    // console.log(connections);
    // console.log('<<<<');


    socket.on('disconnect', function() {
      if (connections.hasOwnProperty(socket.id)) {
        delete connections[socket.id];
        console.log('User "' + socket.request.user.firstname + '" has been disconnected');
        // socket.broadcast.emit('killClient', clientId);
      }
    }); // socket.on('disconnect'


    socket.on('startChat', function(data) {
      console.log('ON:startChat');
      console.log('getSocketCount: ' + getSocketCount());
      console.log('connections count: ' + Object.keys(connections).length);
      console.log(data);
      if (socketIsAuthenticatedUser(socket)) {
        console.log('From authenticated user');
        var toSocketId = findUidinConnections(data.toUid);
        if (toSocketId) {
          console.log('Sending chatRequest to ' + connections[toSocketId].user.uid);
          var requesterUser = getRedactedUser(socket.id);
          connections[toSocketId].socket.emit('chatRequest', {
            fromUid: connections[toSocketId].user.uid,
            toUid: requesterUser.uid
          });
        } else {
          console.log('toUser NOT found');
        }

/*        var roomId = 'chatRoom' + roomCount;
        roomCount++;
        console.log(roomCount);
        //
        socket.join(roomId);
  */
      } else {
        console.log('NOT From authenticated user');
      }

      //console.log(getSocketsinRoom(roomId));
    }); // s


    socket.on('getChatUser', function(data) {
      var user = getRedactedUser(socket.id);
      if (user) {
        socket.emit('chatUser', {
          user: user
        });
      }
    });

    socket.on('chatMessage', function(data) {
      console.log('On:chatMessage');
      console.log(data);

      var toSocketId = findUidinConnections(data.toUid);
      if (toSocketId) {
        var fromUser = getRedactedUser(socket.id);

        connections[toSocketId].socket.emit('chatMessage', {
          fromUser: fromUser,
          message: data.message
        });
/*
        socket.broadcast.to('game').emit('chatMessage', {
          fromUser: fromUser,
          message: data.message
        });
*/
      }
    }); // s


/*    console.log('socketIds (' + socketIds.length + ')');
    console.log(socketIds);
    socketIds.forEach(function(socketId) {
      var socket = io.of(socketNamespace).sockets[socketId];
      if (socket.connected) {
        console.log('connected socket:');
        //console.log(socket);
      }
    });
*/


    monitorIoNs.emit('greetings', {
      message: "You are now connected through websocket " + socketNamespace + "."
    });

    socket.on('getActivityStatus', function(data) {

      var socketIds = Object.keys(io.of(socketNamespace).sockets);
      var nbOnlineUsers = socketIds.length;
      if (nbOnlineUsers > 0) {
        nbOnlineUsers--;
      }

      var nbLoggedIn = 0;
      if (app && app.locals && app.locals.loggedInUsers) {
        nbLoggedIn = Object.keys(app.locals.loggedInUsers).length || 0;
      }


      if (socket.request && socket.request.user && socket.request.user.logged_in) {

        utils.getFriends(socket.request.user).then(function(friends) {
          var onlineFriends = [];
          if (friends) {
            var userFriends = [];
            friends.forEach (function (user) {
              var userFriend = utils.getLeanFriend(user);
              user.profilePic = 'ABC';
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
