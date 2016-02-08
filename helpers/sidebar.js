var Stats = require("./stats"),
	Images = require("./images"),
	Comments = require("./comments"),
	async = require("async");


module.exports = function(viewModel, callback) {
	async.parallel([function(next) {
			Stats(next);
			//console.log(Stats());
		},
		function(next) {
			//console.log(Images.popular());
			//	next(null, Images.popular());
			Images.popular(next);

		},
		function(next) {
			Comments.newest(next);
			//console.log(res);
		}
	], function(err, results) {
		console.log("this is results" + results);
		if (results) {
			viewModel.sidebar = {
				stats: results[0],
				popular: results[1],
				comments: results[2]
			};
		};

		callback(viewModel);
	});



};