// read the configuration. See config.js for details.
var config = require('./config');

// static content and routing
var express = require('express');
var app = require('express')();
var http = require('http');
var server = http.Server(app);
var _ = require('lodash');

var forecasts = require("./forecasts");

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/config', function(req, res) {
  res.send('var config = ' + JSON.stringify(config));
});

var io = require('socket.io')(server);
var socket;

console.log("Trying to start server with config:", config.serverip + ":" + config.serverport);
server.listen(config.serverport, config.serverip, function() {
  console.log("Server running @ http://" + config.serverip + ":" + config.serverport);
});

io.on('connection', function (sckt) {
  socket = sckt;
  updateData();
});

var updateData = function() {
  var data = forecasts.get();

  socket.emit('forecast-update', { data: data });

  // Wait for 30 seconds. And then update the data again.
  setTimeout(updateData, 30000);

}
