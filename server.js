var express = require("express");  
var http    = require("http");                       
var io = require("socket.io"); 
var serveStatic = require('serve-static');  // delete this      
var easyrtc = require("easyrtc");               

var app = express();
app.use(serveStatic('static', {'index': ['index.html']}));

var server = http.createServer(app).listen(3000);

var socketServer = io.listen(server, {"log level":1});

var rtc = easyrtc.listen(app, socketServer);
