exports = module.exports = function(io) {

  var app = require('../app');

  var socketNamespace = '/monitor';
  var monitorIoNs = io.of(socketNamespace); // http://socket.io/docs/rooms-and-namespaces/

  var connections = {};



  monitorIoNs.on('connection', function(socket) {



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

    socket.on('disconnect', function() {
      console.log('DISCONNECTION');
      // socketIds = Object.keys(io.of(socketNamespace).sockets);
      // nbOnlineUsers = socketIds.length;
    }); // socket.on('disconnect'


    // if (socket.request.user && socket.request.user.logged_in) {
    if (socket.request.user) {
      console.log('socket.request.user');
      console.log(socket.request.user);
    } else {
      console.log('No soup for you!');
    }

    monitorIoNs.emit('greetings', {
      message: "You are now connected through websocket " + socketNamespace + "."
    });

    socket.on('getNbLoggedIn', function(data) {

      var socketIds = Object.keys(io.of(socketNamespace).sockets);
      var nbOnlineUsers = socketIds.length;
      if (nbOnlineUsers > 0) {
        nbOnlineUsers--;
      }


      var nbLoggedIn = 0;
      if (app && app.locals && app.locals.loggedInUsers) {
        nbLoggedIn = Object.keys(app.locals.loggedInUsers).length || 0;
      }
      socket.emit('nbLoggedIn', {
        nbOnlineUsers: nbOnlineUsers,
        nbLoggedIn: nbLoggedIn
      });

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
