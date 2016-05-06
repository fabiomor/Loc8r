var request = require('request');
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://obscure-coast-80879.herokuapp.com/";
}


var _formatDistance = function (distance) {
	var numDistance, unit;
	if (distance > 1) {
		numDistance = parseFloat(distance).toFixed(1);
		unit = 'km';
	} else {
		numDistance = parseInt(distance * 1000,10);
		unit = 'm';
	}
	return numDistance + unit;
};

var renderHomePage = function(req, res, responseBody){
	res.render('locations-list', { 
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		locations: responseBody
	});
};

// render uses a jade and a javascript object
module.exports.homelist = function(req, res){
	var requestOptions = {
		url : "http://localhost:3000/api/locations",
		method : "GET",
		json : {},
		qs : {
			lng : 12.107663,
			lat: 42.420673,
			maxDistance: 1000000000000000000
		}
	};
	request(requestOptions, function(err, response, body) {
		var i, data;
		data = body;
		for (i = 0; i < data.length; i++){
			data[i].distance = _formatDistance(data[i].distance);
		}
		renderHomePage(req, res, data);
	});
};

module.exports.locationInfo = function(req, res){
	
};

module.exports.addReview = function(req, res){
	res.render('location-review-form', {
		title: 'Review Starcups on Loc8r',
		pageHeader: { title: 'Review Starcups'}
	});
};