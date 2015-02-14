var fmiData = require("./fmiData");
var parseString = require('xml2js').parseString;
var _ = require('lodash');

function get(){
	var xml = fmiData.get();
	var data = parseAsObject(xml);
	var forecasts = buildForecastPoints(data);
	var json = JSON.stringify(forecasts);

	//console.log(json);

	return json;
}

function parseAsObject(xml){
	var data;
	parseString(xml, function (err, result) {
	    var json = JSON.stringify(result);
	    data = JSON.parse(json);
	}); 
	return data;
}

function buildForecastPoints(data){
	var forecastPoints = {};

	_.forEach(data["wfs:FeatureCollection"]["wfs:member"], function(forecast, index) { 
		var timePoint = forecast["BsWfs:BsWfsElement"][0]['BsWfs:Time'];
		
		if(forecastPoints[timePoint] === undefined){
			forecastPoints[timePoint] = {};
		}

		var attributeName = forecast["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"];
		var attributeValue = forecast["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"];

		console.log(attributeName);

		if (attributeName == "windspeedms") {   
	        forecastPoints[timePoint].windspeed = attributeValue;
	    } else if (attributeName == "winddirection"){
	        forecastPoints[timePoint].winddirection = attributeValue;
		} else if (attributeName == "windGust"){
	        forecastPoints[timePoint].windgust = attributeValue;
		} else if (attributeName == "temperature"){
	        forecastPoints[timePoint].temperature = attributeValue;
		}
	});

	return forecastPoints;
}


exports.get = get;