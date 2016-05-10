var request = require('request');
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://obscure-coast-80879.herokuapp.com/";
}

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
	var numDistance, unit;
	if(distance && _isNumeric(distance)){
		if (distance > 1) {
		numDistance = parseFloat(distance).toFixed(1);
		unit = 'km';
		} else {
			numDistance = parseInt(distance * 1000,10);
			unit = 'm';
		}
		return numDistance + unit;
	} else {
		return "?";
	}
};

var _showErrors = function(req, res, status){
	var title, content;
	if(status === 404){
		title = "404, page not found";
		content = "Sorry, we were unable to find that page";
	} else {
		title = status + ", something is gone wrong";
		content = "Something, somewhere, has gone wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};

var renderHomePage = function(req, res, responseBody){
	var message;
	if(!(responseBody instanceof(Array))){
		responseBody = [];
		message = "Error with API response";
	} else if (!responseBody.length) {
		message = "No locations found nearby";
	}
	res.render('locations-list', { 
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		locations: responseBody,
		message : message
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
			maxDistance: 1
		}
	};
	request(requestOptions, function(err, response, body) {
		var i, data;
		data = body;
		console.log("homelist rendering");
		if(res.statusCode === 200 && data.length){
			for (i = 0; i < data.length; i++){
				data[i].distance = _formatDistance(data[i].distance);
			}
		}
		renderHomePage(req, res, data);
	});
};


var renderDetailPage= function(req, res, locDetail){
	res.render('location-info', {
		title : locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t please leave a review to help other people just like you.'
		},
		location: locDetail
	});
};

var getLocationInfo = function(req, res, callback){
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(requestOptions, function(err, response, body){
		if(response.statusCode === 200){
			var data = body;
			data.coords = {
				lng : body.coords[0],
				lat : body.coords[1]
			};
			callback(req, res, data);	
		} else {
			_showErrors(req, res, response.statusCode);
		}
		
	});
};

module.exports.locationInfo = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData){
		renderDetailPage(req, res, responseData);
	});
};


var renderReviewForm = function(req, res, responseData){
	res.render('location-review-form', {
		title: "Review of " +  responseData.name +" on Loc8r",
		pageHeader: { title: 'Review of ' + responseData.name}
	});
};


module.exports.doAddReview = function(req, res){
	var requestOptions, locationid, path, postData;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + "reviews";
	postData = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};

};


module.exports.addReview = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData){
		renderReviewForm(req, res, responseData);
	});
};


