var httpsync = require('httpsync');

function get(){
	var url = 'http://data.fmi.fi/fmi-apikey/55d44f5f-70e8-4d88-9d5e-ee083dcd0ca3/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::cities::timevaluepair&place=oulu&starttime=2015-02-07T00:00:00Z&endtime=2015-02-08T00:00:00Z&parameters=windspeedms,temperature';

	var req = httpsync.get({ url : url});
	var res = req.end();
	console.log(res)

	return res.data;
}

exports.get = get;