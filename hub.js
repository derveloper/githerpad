var io = require('socket.io').listen(1337);
var _ = require('underscore');

var latest = "";

io.sockets.on('connection', function (socket) {
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      socket.broadcast.emit('user connected',name);
      socket.emit('ready');
      socket.broadcast.emit('update revision',latest);
    });
  });

  socket.on('push revision', function (data) {
    socket.get('nickname', function (err, name) {
      console.log('revision by ', name);
      latest = data;
      console.log(data);
      socket.broadcast.emit('update revision',latest);
    });
  });
});