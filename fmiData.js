var httpsync = require('httpsync');
var dateUtils = require('date-utils');
var moment = require('moment');

function get(){
	var dateFormat = "YYYY-MM-DDTHH:mm:ss"
	var startTime = moment(Date.now()).format(dateFormat) + "Z";
	var endTime = moment(Date.today().add({days: 7})).format(dateFormat)+ "Z";

	console.log("Fetching FMI data");
	console.log("Start time: " + startTime);
	console.log("End time: " + endTime);

	var parameters = 'windspeedms,winddirection,windGust,temperature';
	var url = 'http://data.fmi.fi/fmi-apikey/55d44f5f-70e8-4d88-9d5e-ee083dcd0ca3/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple&place=oulu&starttime=' + startTime + '&endtime=' + endTime + '&parameters='+parameters;
	console.log(url);

	var req = httpsync.get({ url : url});
	var res = req.end();

	return res.data;
}

exports.get = get;