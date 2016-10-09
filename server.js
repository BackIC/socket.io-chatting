var http = require('http');
var socketio = require('socket.io');

var server = http.createServer(function(req, res) {
}).listen(25560, function() {
  console.log('Server running');
});

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {

  socket.on('disconnect', function(data223) {
    chatTemp = "<b>" + socket.name + "님이 퇴장하셨습니다.</b>"
    io.sockets.emit('recv', chatTemp);
    console.log(socket.name + " Exit");
    renewMemeber();
  });

  socket.on('ptrans', function(data) {
    ok = false;
    sckObj = null;

    for(i in users = io.sockets.sockets) {
      if(users[i].name == data[0]) {
        sckObj = users[i];
      }
    }
    if(sckObj) {
      chatTemp = socket.name + " -> " + sckObj.name + " : " + data[1];
      sckObj.emit('recv', chatTemp);
      socket.emit('recv', chatTemp);
    }
  });
  socket.on('trans', function(data) {
    chatTemp = socket.name + " : " + data;
    io.sockets.emit('recv', chatTemp);
    console.log(socket.name + " : "+ data);

  });

  socket.on('nickChange', function(data, res) {
    var ok = true;

    if(data !== "" || data != null) {
      for(i in users = io.sockets.sockets) {
        if(users[i].name == data) {
          ok = false;
        }
      }
    } else {
      ok = false;
    }

    if(ok) {
      prevname = socket.name;
      socket.name = data;

      if(prevname == null) {
        chatTemp = "<b>" + socket.name + "님이 입장하셨습니다.</b>"
        io.sockets.emit('recv', chatTemp);
      } else {
        chatTemp = "<b>" + prevname + " -> " + socket.name + "</b>"
        io.sockets.emit('recv', chatTemp);
      }
      renewMemeber();
      res(true);
    } else {
      res(false);
    }
  });
});

function renewMemeber() {
  var userTemp = [];
  for(i in users = io.sockets.sockets) {
    if(users[i].name != null) {
      userTemp.push(users[i].name);
    }
  }
  io.sockets.emit('renewMemeber', userTemp);
}
