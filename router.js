var forecasts = require("./forecasts");

function route(pathname) {
  console.log("About to route a request for " + pathname);

  var response = "";

  switch(pathname) {
    case "/api/forecast":
       	response = forecasts.get();
        break;
    default:
        console.log("Unknown requrest");
	}

	return response;
}

exports.route = route;