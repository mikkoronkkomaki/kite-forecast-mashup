var fmiData = require("./fmiData");

function get(){
	return fmiData.get();
}

exports.get = get;