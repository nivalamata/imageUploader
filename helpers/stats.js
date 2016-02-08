/**
 * Module dependency
 */
var models = require("../models"),
	async = require("async");


module.exports = function(callback) {
	async.parallel([
		function(next) {
			models.Image.count({}, function(err, total) { //short hand notation  models.Image.count({}, next); cuz signature match
				next(err, total);
			});
		},
		function(next) {
			models.Comment.count({}, next);
		},
		function(next) {
			models.Image.aggregate({
				$group: {
					_id: "1",
					viewsTotal: {
						$sum: "$views"
					}
				}
			}, function(err, results) {
				var viewsTotal = 0;
				if (results.length > 0) {
					viewsTotal += results[0].viewsTotal;
				};
				next(null, viewsTotal);
			});
		},

		function(next) {
			models.Image.aggregate({
				$group: {
					_id: '1',
					likesTotal: {
						$sum: '$likes'
					}
				}
			}, function(err, result) {
				var likesTotal = 0;
				if (result.length > 0) {
					likesTotal += result[0].likesTotal;
				}
				next(null, likesTotal);
			});
		}
	], function(err, result) {
		callback(null, {
			images: result[0],
			comments: result[1],
			views: result[2],
			likes: result[3]
		});
	});



};