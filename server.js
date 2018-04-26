var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require ('socket.io').listen(server);

var streams = {};
var connections = [];

var constraints = window.constraints = {
	video: true,
	audio: false
}

server.listen(process.env.PORT || 3000);
console.log('Server runnnig on port: 3000');

app.use(express.static('dir'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	connections.push(socket);

	socket.on('disconnect', function (data) {
		if (!socket.streamName) return;
		streams.splice(strams.indexOf(socket.streamName), 1)
		updateStreams();

		connections.splice(connections.indexOf(socket, 1));
	});

	socket.on('send comment', function (data) {
		io.sockets.emit('new comment', {comment: data});
	})

	socket.on('new stream', function (data, cb) {
		callback(true);
		socket.streamName = data;
		users.push(socket.streamName);
		updateStreams();
	})

	function updateStreams() {
		io.sockets.emit('get streams', streams)
	}

	function handleSuccess(stream) {
      window.stream = stream;
      io.sockets.emit('broadcast stream', stream)
      localVideo.srcObject = stream;
    }

	function errorStream (error) {
      console.log('getUserMedia error: ' + error.name, error);
    }

	function beginStream {
		navigator.mediaDevices.getUserMedia(constraints).then(successStream).catch(errorStream);
	}
});