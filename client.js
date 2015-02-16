var utils = (function() {

  // function copied from http://stackoverflow.com/questions/10958869/jquery-get-css-properties-values-for-a-not-yet-applied-class
  var getCss = function (fromClass, prop) {
    var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector); // add to DOM, in order to read the CSS property
    try {
        return $inspector.css(prop);
    } finally {
        $inspector.remove(); // and remove from DOM
    }
  };

  return {
    getCss: getCss
  };

}());


var forecasts = function() {
  var data;
  var socket;

  var init = function() {
    initConnection();
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

    // Listen for server hello event
    socket.on('forecast-update', function (e) {
      console.log("Server says:", e.data);
      data = JSON.parse(e.data).forecasts;
      update();
    });

    // pong to our ping
    socket.on('pong', function (data) {
      if(data.id == self.pingtime) {
        document.getElementById('ping').innerHTML = Date.now() - self.pingtime + " ms";
      }
      else {
        console.log("pong failed:", data.id, self.pingtime);
      }
    });

  }

  var colorScale = d3.scale.category10();

  var margin = {
    top: 24,
    bottom: 24,
    left: 24,
    right: 24
  };

  var update = function() {
    var g = d3.select(".chart");

    var maxParticipants = 99;

    var x = d3.scale.linear()
        .domain([0, maxParticipants])
        .range([0, 1000]);

    var barThickness = 20;
    var barSpace = 48;

    var fgColor = utils.getCss("primary", "color");

    var bgColor = function(d) {
      return colorScale(d.category);
    };

    var courseX = function(d, i) {
      return 10;
    };

    var courseY = function(d, i) {
      return margin.top + i * (barThickness + barSpace);
    }

    var bar = g.selectAll(".wind-bar")
      .data(data, function(d) { return d.time; });

    var titleText = g.selectAll('.course-title')
      .data(data, function(d) { return d.time; });

    // UPDATE existing
    bar
      .style("fill", bgColor)
      .attr("x", courseX)
      .attr("y", courseY);

    titleText
      .attr("x", courseX)
      .attr("y", courseY);

    // ENTER
    bar.enter()
      .append("rect")
        .attr("class", "wind-bar")
        .attr("x", courseX)
        .attr("y", courseY)
        .attr("width", function(d) { return x(d.windspeed) })
        .attr("height", barThickness)
        .style("fill", "#ffff00")
        .style("fill-opacity", 1e-6)
        .on("click", function(d) {
          data = _.filter(data, function(item) { return item.id != d.id});
          update();
        })
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "#0066ff");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", bgColor);
        })
        .append("title")
          .text(function(d) { return "Time:" + d.time 
        });

    bar.transition()
      .duration(750)
      .style("fill-opacity", 1);

    titleText.enter()
      .append('text')
      .attr('x', courseX)
      .attr('y', courseY)
      .attr('dy', 16)
      .text(function(d) {
        return "Time: " + d.time;
      })
      .style('font-weigth', 'bold');


    // EXIT
    bar.exit()
      .transition()
        .duration(2000)
        .attr("x", 1000)
        .attr("y", 1000)
        .attr("fill", "red")
      .remove();

  };

  return {
    init: init,
    update: update
  }

};
