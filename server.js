var mapFunc = require('./mapFunc.js');

var debug = true;
var data_seg = new Array();
var x_gps;
var y_gps;


//-----------net modual--------------
var net = require('net');
var clients = [];
// Start a TCP Server without listening on the port
var server = net.createServer(function (socket) {
  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort
  // Put this new client in the list
  clients.push(socket);
  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n");
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    $('#messages').append($('<li>').text(data));
    var msg = String.fromCharCode.apply(null, new Uint16Array(data));
    if (debug) {
      console.log('data: ' + msg);
      console.log(typeof(msg));
    }

    //extract gps infomation from raw data
    data_seg = msg.split(",");
    console.log(data_seg.length);
    if(data_seg.length >= 3) {
      x_gps = mapFunc.gpsFix(data_seg[1],'lng');
      y_gps = mapFunc.gpsFix(data_seg[2],'lat');

      if (debug)
      {
        console.log('data_seg[0]: ' + data_seg[0]);
        console.log('data_seg[1]: ' + data_seg[1]);
        console.log('data_seg[2]: ' + data_seg[2]);
        console.log('data_seg[3]: ' + data_seg[3]);
        console.log('x_gps: ' + x_gps);
        console.log('y_gps: ' + y_gps);
      }
      //call cor covert function
      mapFunc.UpdateLoc(x_gps,y_gps,1);
    } else {
      console.log('data error! ');
    }
  });
  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    console.log('user disconnected');
    $('#messages').append($('<li>').text('client disconnected'));
  });
});

//get port value from input, and start listening
exports.startListen = function startListen(){

  var netPort = document.getElementById("inputport").value;
  if (netPort<0 || netPort> 65535 || netPort == "") {
    alert('invailed port value!');
  }
  else {
    server.listen(netPort);
    console.log('server listening on port: ' + netPort);
    $('#messages').append($('<li>').text('listening on port: ' + netPort));
  }
}
