window.socket = io.connect('http://' + window.location.host + ':1337');
$(function() {
  $("#pad").on("keyup", function() {
    socket.emit('push revision', $(this).val());
  });

  var name = "foo" + new Date();

  socket.on('ready', function() {
    console.log("ready");
    addClient(name);
  });

  socket.on('user connected', function(name) {
    addClient(name);
  });

  socket.on('update revision', function(data) {
    if (data.pad === window.location.pathname) {
      $("#pad").val(data.content);
    }
  });

  socket.emit('set nickname', name);
  socket.emit('set pad', window.location.pathname);

});

function addClient(name) {
  var $clientlist = $("#clientlist ul");
  $clientlist.append($("<li/>").html(name));
}