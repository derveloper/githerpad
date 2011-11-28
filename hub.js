var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , exec = require('child_process').exec
  , fs = require('fs');

app.listen(1337);

var _ = require('underscore');

var latest = "";
var currentPad = "";

io.sockets.on('connection', function (socket) {
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      socket.broadcast.emit('user connected',name);
      socket.emit('ready');
    });
  });

  socket.on('set pad', function (name) {
    socket.set('pad', name);
    socket.get('pad',function(err,data) {readPadAndPush(socket,err,data,false)});
  });

  socket.on('push revision', function (data) {
    socket.get('pad',function(err,name) {
      updatePad(data,name);
    });
    socket.get('nickname', function (err, name) {
      console.log('revision by ', name);
      latest = data;
      console.log(data);
      socket.get('pad',function(err,data) {readPadAndBroadcast(socket,err,data)});
    });
  });
});

function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function updatePad(content,pad) {
  var stream = fs.createWriteStream(__dirname + '/pads/'+pad);
  stream.end(content);
  exec('cd '+ __dirname + '/pads; git add ./'+pad+'; git commit -m"rev"' );
}

function readPad(pad,callback) {
  fs.readFile(__dirname + '/pads/'+pad,"utf8",callback);
}

function readPadAndBroadcast(socket,err,name) {
  readPadAndPush(socket,err,name,true);
}

function readPadAndPush(socket,err,name,broadcast) {
  readPad(name, function(err,data) {
    var payload = {pad: name, content: data};
    console.log(data);
    if(broadcast) {
      socket.broadcast.emit('update revision',payload);
    } else {
      socket.emit('update revision',payload);
    }
  });
}

