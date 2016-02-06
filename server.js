/**
 * Server  module boot up the HTTP server and start the whole
 * process of configurations and listern for all
 * HTTP events.
 */

var express = require("express");
var config = require("./server/configure");
var app = express(),
	mongoose = require("mongoose"); //executing express and gives app object that power up entire application

/**
 * defines settings for application constants
 * and configurations
 */
app.set("port", process.env.PORT || 3030);
app.set("views", __dirname + "/views"); //__dirname ->global variable per module,means name of the directory currently script resides in
app = config(app);
//connect to mongoDb server
mongoose.connect("mongodb://localhost/imguploader");
mongoose.on("open", function() {
	console.log("Mongoose connected");
});

var server = app.listen(app.get("port"), function() {
	console.log("server up: http://localhost:" + app.get("port"));
});