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

    var maxWindspeed = 40;

    var x = d3.scale.linear()
        .domain([0, maxWindspeed])
        .range([0, 1000]);

    var barThickness = 20;
    var barSpace = 48;

    var fgColor = utils.getCss("primary", "color");

    var bgColor = function(d) {
      return colorScale(d.category);
    };

    var timeBarX = function(d, i) {
      return 10;
    };

    var timeBarY = function(d, i) {
      return margin.top + i * (barThickness + barSpace);
    }

    var bar1 = g.selectAll(".time-bar1").data(data, function(d) { return d.time; });

    var titleText = g.selectAll('.forecast-title').data(data, function(d) { return d.time; });

    // UPDATE existing
    bar1
      .style("fill", bgColor)
      .attr("x", timeBarX)
      .attr("y", timeBarY);

    titleText
      .attr("x", timeBarX)
      .attr("y", timeBarY);

    // ENTER
    bar1.enter()
      .append("rect")
        .attr("class", "time-bar1")
        .attr("x", timeBarX)
        .attr("y", timeBarY)
        .attr("width", function(d) { 
          var windspeed = d.windspeed;
          if (windspeed === null) {
            windspeed = 0;
          };
          return x(windspeed); 
        })
        .attr("height", barThickness)
        .style("fill", "#ffff00")
        .style("fill-opacity", 1e-6)
        .on("click", function(d) {
          data = _.filter(data, function(item) { return item.time != d.time});
          update();
        })
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "#0066ff");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", bgColor);
        })
        .append("title")
          .text(function(d) { return "Voje:" + d.time 
        });

    bar1.transition()
      .duration(750)
      .style("fill-opacity", 1);

    titleText.enter()
      .append('text')
      .attr('x', timeBarX)
      .attr('y', timeBarY)
      .attr('dy', 16)
      .text(function(d) {
        return "Time: " + d.time + " Wind speed: " + d.windspeed;
      })
      .style('font-weigth', 'bold');


    // EXIT
    bar1.exit()
      .transition()
        .duration(2000)
        .attr("x", 1000)
        .attr("y", 1000)
        .attr("fill", "red")
      .remove();

    var bar2 = g.selectAll(".time-bar2").data(data, function(d) { return d.time; });

    var timeBar2X = function(d, i) {
      return 10;
    };

    var timeBar2Y = function(d, i) {
      return margin.top + i * (barThickness + barSpace) + 25;
    }

    titleText = g.selectAll('.forecast-title').data(data, function(d) { return d.time; });

    // UPDATE existing
    bar2
      .style("fill", bgColor)
      .attr("x", timeBar2X)
      .attr("y", timeBar2Y);

    titleText
      .attr("x", timeBar2X)
      .attr("y", timeBar2Y);

    // ENTER
    bar2.enter()
      .append("rect")
        .attr("class", "time-bar2")
        .attr("x", timeBar2X)
        .attr("y", timeBar2Y)
        .attr("width", function(d) { 
          var windspeed = d.windgust;
          if (windspeed === null) {
            windspeed = 0;
          };
          return x(windspeed); 
        })
        .attr("height", barThickness)
        .style("fill", "#ffff00")
        .style("fill-opacity", 1e-6)
        .on("click", function(d) {
          data = _.filter(data, function(item) { return item.time != d.time});
          update();
        })
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "#0066ff");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", bgColor);
        })
        .append("title")
          .text(function(d) { return "Voje:" + d.time 
        });

    bar2.transition()
      .duration(750)
      .style("fill-opacity", 1);

    titleText.enter()
      .append('text')
      .attr('x', timeBar2X)
      .attr('y', timeBar2Y)
      .attr('dy', 16)
      .text(function(d) {
        return "Time: " + d.time + " Wind gusts: " + d.windgust;
      })
      .style('font-weigth', 'bold');


    // EXIT
    bar2.exit()
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
