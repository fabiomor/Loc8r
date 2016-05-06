var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJSONResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};


var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

var updateAverageRating = function(locationid){
  console.log("Update rating average for", locationid);
  Loc
    .findById(locationid)
    .select('reviews')
    .exec(
      function(err, location){
        if(err){
          console.log(err);
        } else {
          doSetAverageRating(location);
        }
      }
    );
};


var doAddReview = function(req, res, location){
	if(!location){
		sendJSONResponse(res, 404, {
			'message' : 'Not found, locationid required'
		});
	} else{
    console.log('Adding review to ' + location.name);
		location.reviews.push({
			author: req.body.author,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});
		location.save(function(err, location){
      var thisReview;
      if(err){
        sendJSONResponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJSONResponse(res, 201, thisReview);
      }
    });
	}
};


var onSelectReviewUpdateOne = function(req, res, err, location){
 
};

/* POST a new review, providing a locationid */
/* /api/locations/:locationid/reviews */
module.exports.reviewsCreate = function (req, res) {
	var locationid = req.params.locationid;
	if(locationid){
		Loc
			.findById(locationid)
			.select('reviews name')
			.exec(
				function(err, location){
					if(err){
						sendJSONResponse(req, 400, err);
					} else {
						doAddReview(req, res, location);
					}
				}
			);
	} else {
		sendJSONResponse(res, 404, {
			'message' : 'Not found, locationid required'
		});
	}
};

module.exports.reviewsReadOne = function(req, res) {
  console.log("Getting single review");
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location) {
          console.log(location);
          var response, review;
          if (!location) {
            sendJSONResponse(res, 404, {
              "message": "locationid not found"
            });
            return;
          } else if (err) {
            sendJSONResponse(res, 400, err);
            return;
          }
          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            console.log('idreview retrieved: ' + req.params.reviewid);
            console.log('review retrieved: ' + review);
            if (!review) {
              sendJSONResponse(res, 404, {
                "message": "reviewid not found"
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJSONResponse(res, 200, response);
            }
          } else {
            sendJSONResponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
    );
  } else {
    sendJSONResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};

module.exports.reviewsUpdateOne = function (req, res) {
  var locationid = req.params.locationid;
  var reviewid = req.params.reviewid;
  if( locationid && reviewid){
    Loc
      .findById(locationid)
      .select("reviews name")
      .exec(
        function(err, location){
          // check on location
          var thisReview;
          if(!location){
            sendJSONResponse(res, 404, err);
          } else if (err) {
            sendJSONResponse(res, 400, err);
            return;
          } else {
            if(location.reviews && location.reviews.length > 0){
              thisReview = location.reviews.id(req.params.reviewid);
              if(!thisReview){
                sendJSONResponse(res, 404, {
                  "message": "reviewid not found"
                });
              } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                location.save(function(err, location){
                  if(err){
                    sendJSONResponse(res, 404, err);
                  } else {
                      updateAverageRating(location._id);
                      sendJSONResponse(res, 200, thisReview);
                  }  
                });
              }
            }
          }
        }
      );
  } else {
    sendJSONResponse(res, 404, {
      "message" : "Not found, locationid and reviewid are both required"
    });
  }
};

module.exports.reviewsDeleteOne = function (req, res) {
  var locationid = req.params.locationid;
  if(locationid){
    Loc
      .findByIdAndRemove(locationid)
      .exec(
        function(err, location){
          if(err){
            sendJSONResponse(res, 404, err);
          } else {
            sendJSONResponse(res, 404, null);
          }
        }
      );
  } else {
    sendJSONResponse(res, 404, {
      "message" : "No locationid"
    });
  }
};


