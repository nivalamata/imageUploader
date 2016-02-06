//install template rendering engine for HTML engines "handlebars" 
//npm install express-handlebars --save
//

/**
 * Module dependency
 */
var connect = require("connect"),
	path = require("path"),
	routes = require("./routes"),
	moment = require("moment"),
	exphbs = require("express3-handlebars");

module.exports = function(app) {
	// configuration code	
	app.engine("handlebars", exphbs.create({
		defaultLayout: "main",
		layoutsDir: app.get("views") + "/layouts",
		partialsDir: [app.get("views") + "/partials"],
		helpers: {
			timeago: function(timestamp) {
				return new Date(); // moment(timestamp).startof("minute").fromNow();
			}
		}
	}).engine);
	app.set("view engine", "handlebars");
	//register middleware that are going to be used
	//order of registration matters
	app.use(connect.logger("dev"));
	app.use(connect.bodyParser({
		uploadDir: path.join(__dirname, "../public/upload/temp")
	}));
	app.use(connect.json());
	app.use(connect.urlencoded());
	app.use(connect.methodOverride());
	app.use(connect.cookieParser("some-secret-value-here"));
	//register server router which will respond to requests GET,POST,PUT and UPDATE
	app.use(app.router);
	//render static content files to the browser from a predefined static resource dir 
	app.use("/public/", connect.static(path.join(__dirname, "../public")));

	if ("development" === app.get("env")) {
		app.use(connect.errorHandler());
	};

	routes.initialize(app);
	return app;
};