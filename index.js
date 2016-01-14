
var app= require('app');
var BrowserWindow = require('browser-window');


var mainWindow = null;

app.on('ready',function(){
  var mainWindow = new BrowserWindow( {
    width: 1300,
    height: 550
  });
  mainWindow.loadURL('file://' + __dirname + '/PinLoc.html');
  mainWindow.openDevTools();
});
