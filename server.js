const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require ('socket.io').listen(server);
const path = require('path');

var streams = [];
var users = [];
var connections = [];

var constraints = {
	video: true,
	audio: true
}

server.listen(process.env.PORT || 3000);
console.log('Server runnnig on port: 3000');

app.use(express.static(path.join(__dirname, 'dir')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	connections.push(socket);

	socket.on('disconnect', function (data) {
		if (!socket.streamName) return;
		streams.push(socket.streamName);
		updateStreams();

		connections.splice(connections.indexOf(socket, 1));
	});

	socket.on('new user', function (data, cb) {
		cb(true);
		socket.username = data;
		users.push(socket.username);
		updateStreams();
	})

	socket.on('send comment', function (data) {
		io.emit('new comment', {comment: data});
	})

	socket.on('new stream', function (data, cb) {
		cb(true);
		socket.streamName = data;
		streams.push(socket.streamName);
		updateStreams();
	})

	socket.on('broadcast stream', function () {
		beginStream();
	})

	function updateStreams() {
		io.emit('get streams', streams);
	}

	function handleSuccess(stream) {
      window.stream = stream;
      io.sockets.emit('show stream', stream)
      localVideo.srcObject = stream;
    }

	function errorStream (error) {
      console.log('getUserMedia error: ' + error.name, error);
    }

	function beginStream () {
		navigator.mediaDevices.getUserMedia(constraints).then(successStream).catch(errorStream);
	}
});