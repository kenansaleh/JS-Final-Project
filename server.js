var app = require('express')();
var server = require('http').Server(app);
var socket = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});


var streams = {} 
var numStreams = 0;

socket.on('connection', function (socket) {

	socket.emit('current_streams', streams);

	socket.on('create_stream', function (stream) {

		var newStream = {
			host: socket.in,
			numViewers: 0,
			viewers: {},
			id: numStreams
		}

		numStreams++;

		streams[newStream.id] = newStream;
		socket.emit('stream_added', newStream);
	});

	socket.on('enter_stream', function (id, viewer) {
		if (streams[id]) {
			socket.join('Stream ' + id);
			socket.to('Stream ' + id).emit('viewer_joined', viewer);
		}
	})
});