

var client = function() {
  var data;
  var socket;
  var updateCallback;

  var init = function(callback) {
    initConnection();
    updateCallback = callback;
  };

  var initConnection = function() {
    var connString = config.protocol + config.domain + ':' + config.clientport;
    console.log("Websocket connection string:", connString, config.wsclientopts);
    socket = io.connect(connString, config.wsclientopts);

    socket.on('connect', function () { 
      console.log("Websocket 'connected': ", socket);
      document.getElementById('top').innerHTML = "Connected.";
    });

    socket.on('error', function (err) {
      console.log("Websocket 'error' event:", err);
    });

    socket.on('disconnect', function () {
      console.log("Websocket 'disconnect' event");
      document.getElementById('top').innerHTML = "Disconnected.";
    });

    socket.on('forecast-update', function (e) {
      console.log("Server says:", e.data);
      data = JSON.parse(e.data).forecasts;
      update();
    });

    socket.on('pong', function (data) {
      if(data.id == self.pingtime) {
        document.getElementById('ping').innerHTML = Date.now() - self.pingtime + " ms";
      }
      else {
        console.log("pong failed:", data.id, self.pingtime);
      }
    });

  }

  var update = function() {
      updateCallback(data);
  };

  return {
    init: init,
    update: update
  }

};
