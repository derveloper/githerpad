window.socket = io.connect('http://' + window.location.host + ':1337');
window.connected = false;
window.suppressUpdate = false;
$(function() {
  $("#pad").on("keyup", function() {
    socket.emit('push revision', $(this).val());
  });

  $("#revision").on("change", function() {
    socket.emit('get revision', {pad:window.location.pathname,rev:$(this).val()});
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
      var carPos = $("#pad").getCursorPosition();
      $("#pad").val(data.content);
      $("#pad").setCursorPosition(carPos);
    }
  });

  socket.on("current revisions", function(count) {
    $("#revision").attr("max",count);
    $("#revision").val(count);
  });

  socket.emit('set nickname', name);
  socket.emit('set pad', window.location.pathname);

});

function addClient(name) {
  var $clientlist = $("#clientlist ul");
  $clientlist.append($("<li/>").html(name));
}