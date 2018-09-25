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

const MAX_FOOD = 100;

var players = {};

var foodList = [];

for (var i = 0; i < MAX_FOOD; i++) {
	var food_x = Math.floor((Math.random() * 800) + 1);
	var food_y = Math.floor((Math.random() * 600) + 1);
	foodList.push({
		x: food_x,
		y: food_y
	});
}

var gameState = {
	players: players,
	foods: foodList
}

io.on('connection', function(socket) {
	socket.on('new player', function(data) {
		players[socket.id] = {
			name: data,
			x: 300,
			y: 300,
			r: 10
		};
	});

	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if (data.left) {
			player.x -= 5;
		}
		if (data.up) {
			player.y -= 5;
		}
		if (data.right) {
			player.x += 5;
		}
		if (data.down) {
			player.y += 5;
		}

		for(var foodId in foodList) {
			var food = foodList[foodId];
			var dx = food.x - player.x;
			var dy = food.y - player.y;
			if (Math.sqrt(dx*dx + dy*dy) <= (player.r+3)) {
				player.r++;
				foodList[foodId].x = Math.floor((Math.random() * 800) + 1);
				foodList[foodId].y = Math.floor((Math.random() * 600) + 1);
			}
		}

		
	});

	socket.on('disconnect', function() {
    	players[socket.id] = {};
  	});
});

setInterval(function() {
	io.sockets.emit('state', gameState);
}, 1000/60);

