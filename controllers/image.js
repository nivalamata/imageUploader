/**
 * Module dependency
 */
var sidebar = require("../helpers/sidebar"),
	fs = require("fs"),
	path = require("path"),
	Models = require("../models"),
	MD5 = require("MD5");


module.exports = {

	index: function(req, res) {
		var viewModel = {
			image: {},
			comments: []
		};
		//find the image by searching the filename
		//matching the url parameter
		Models.Image.findOne({
				filename: {
					$regex: req.params.image_id
				}
			},
			function(err, image) {
				if (err) {
					throw err
				};
				if (image) {
					//if the image was found, increment its views counter
					//
					image.views = image.views + 1;
					viewModel.image = image;
					image.save();

					//find any comment with the same image_id as the image.
					Models.Comment.find({
						image_id: image._id
					}, {}, {
						sort: {
							"timestamp": 1
						}
					}, function(err, comments) {
						if (err) {
							throw err
						};
						//save the comments collection to the view model
						viewModel.comments = comments;
						//build the sidebar sending along the viewModel
						sidebar(viewModel, function(viewModel) {
							console.log(viewModel);
							//render the page view with its model
							res.render('image', viewModel);
						});
					});
				} else {
					//if no image was found simply go to the homepage.
					res.redirect("/");
				}
			});


	},
	create: function(req, res) {
		var saveImage = function() {

			var possible = "abcdefghijklmnopqrstuvwxyz0123456789",
				imgUrl = "";

			for (var i = 0; i < 6; i++) {
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));

			};
			//search for an image with the same filename by performing a find
			//
			Models.Image.find({
				filename: imgUrl
			}, function(err, images) {
				if (err) {
					throw err
				};
				if (images.length > 0) {
					//if  a mataching image was found, try again(start over):
					saveImage();
				} else {
					//do all the existing work
				}
			});

			var tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve("./public/upload/" + imgUrl + ext);

			if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
				fs.rename(tempPath, targetPath, function(err) {
					if (err) throw err;
					//check out req object
					console.log(req);
					//create new image model, populate its details
					var newImg = new Models.Image({
						title: req.body.title,
						description: req.body.description,
						filename: imgUrl + ext
					});

					newImg.save(function(err, image) {
						console.log("successfully inserted image: " + image.filename);
						res.redirect("/images/" + image.uniqueId);
					});
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
		Models.Image.findOne({
			filename: {
				$regex: req.params.image_id
			}
		}, function(err, image) {
			if (!err && image) {
				image.likes = image.likes + 1;
				image.save(function(err) {
					if (err) {
						res.json(err);
					} else {
						res.json({
							likes: image.likes
						});
					}
				});
			}
		});
	},
	comment: function(req, res) {
		Models.Image.findOne({
			filename: {
				$regex: req.params.image_id
			}
		}, function(err, image) {
			if (!err && image) {
				// hack cuz HTML form uses form fields that have the same name and structure as that of a Comment model
				var newComment = new Models.Comment(req.body);
				newComment.gravatar = MD5(newComment.email);
				newComment.image_id = image._id;
				newComment.save(function(err, comment) {
					if (err) {
						throw err;
					}
					//load at specific comment
					res.redirect("/images/" + image.uniqueId + "#" + comment._id);
				});
			} else {
				res.redirect("/");
			}
		});
	}
};