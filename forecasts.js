var fmiData = require("./fmiData");
var parseString = require('xml2js').parseString;
var _ = require('lodash');

function get(){
	var xml = fmiData.get();
	var data = parseAsObject(xml);
	var forecasts = buildForecasts(data);
	var json = JSON.stringify(forecasts);

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

function buildForecasts(data){
	var forecastPoints = {};

	_.forEach(data["wfs:FeatureCollection"]["wfs:member"], function(forecast, index) { 
		var timePoint = forecast["BsWfs:BsWfsElement"][0]['BsWfs:Time'];
		
		if(forecastPoints[timePoint] === undefined){
			forecastPoints[timePoint] = {};
		}

		var attributeValue = parseInt(forecast["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0]);	
		var attributeName = forecast["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"];		

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

	var data = {forecasts:[]};

	_.forEach(Object.keys(forecastPoints), function(key, index) { 
		var forecast = forecastPoints[key];
		forecast.time = key;
		data.forecasts.push(forecast);
	});

	return data;
}

exports.get = get;