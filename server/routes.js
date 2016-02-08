/**
 * Maps each abailable URL paths for the app
 * every route on the server will correspond to a function in a controller.
 */


var home = require("../controllers/home"),
	image = require("../controllers/image");

module.exports.initialize = function(app) {
	app.get("/", home.index);
	app.get("/images/:image_id", image.index); //'/images/:image_id' that basically equates to '/images/ANYVALUE' in the browser address bar

	app.post("/images", image.create);
	app.post("/images/:image_id/like", image.like);
	app.post("/images/:image_id/comment", image.comment);

	app.delete("/images/:image_id", image.remove);
};