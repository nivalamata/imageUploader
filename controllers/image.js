/**
 * Module dependency
 */
var sidebar = require("../helpers/sidebar"),
	fs = require("fs"),
	path = require("path");


module.exports = {

	index: function(req, res) {
		var viewModel = {
			image: {
				uniqueId: 1,
				title: 'Sample Image 1',
				description: 'This is a sample.',
				filename: 'sample1.jpg',
				views: 0,
				likes: 0,
				timestamp: Date.now
			},
			comments: [{
				image_id: 1,
				email: 'test@testing.com',
				name: 'Test Tester',
				gravatar: 'http://lorempixel.com/75/75/animals/1',
				comment: 'This is a test comment...',
				timestamp: Date.now()
			}, {
				image_id: 1,
				email: 'test@testing.com',
				name: 'Test Tester',
				gravatar: 'http://lorempixel.com/75/75/animals/2',
				comment: 'Another followup comment!',
				timestamp: Date.now()
			}]
		};

		console.log(viewModel);

		//res.render('image', viewModel);
		sidebar(viewModel, function(viewModel) {
			console.log(viewModel);
			res.render('image', viewModel);
		});
	},
	create: function(req, res) {
		var saveImage = function() {

			var possible = "abcdefghijklmnopqrstuvwxyz0123456789",
				imgUrl = "";

			for (var i = 0; i < 6; i++) {
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));

			};

			var tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve("./public/upload/" + imgUrl + ext);

			if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
				fs.rename(tempPath, targetPath, function(err) {
					if (err) throw err;
					//check out req object
					console.log(req);
					res.redirect("/images/" + imgUrl);
				});
			} else {
				fs.unlink(tempPath, function(err) {
					if (err) throw err;
					res.json(500, {
						error: "only image files are allowed"
					});
				});
			};
		};
		saveImage();
	},
	like: function(req, res) {
		res.json({
			likes: 1
		});
		console.log(res);
	},
	comment: function(req, res) {
		res.send("The Image:comment POST Controller");
	}
};