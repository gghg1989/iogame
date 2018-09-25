var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));	
});

server.listen(5000, function() {
	console.log('Starting server on port 5000...');
});

var players = {};

var lastUpdateTime = (new Date()).getTime();

io.on('connection', function(socket) {
	socket.on('new player', function(data) {
		players[socket.id] = {
			name: data,
			x: 300,
			y: 300
		};
	});

	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		setInterval(function() {
			var currentTime = (new Date()).getTime();
			var timeDifference = currentTime - lastUpdateTime;
			if (data.left) {
				player.x -= 5*timeDifference;
			}
			if (data.up) {
				player.y -= 5*timeDifference;
			}
			if (data.right) {
				player.x += 5*timeDifference;
			}
			if (data.down) {
				player.y += 5*timeDifference;
			}
			lastUpdateTime = currentTime;
		}, 1000/60);
	});

	socket.on('disconnect', function() {
    	players[socket.id] = {};
  	});
});

setInterval(function() {
	io.sockets.emit('state', players);
}, 1000/60);

