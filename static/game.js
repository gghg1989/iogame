var socket = io();

var player = prompt("Please enter your name", "new player");

if (player == null || player == "") {
    playerName = "new player";
} else {
    playerName = player;
}

var movement = {
	up: false,
	down: false,
	left: false,
	right: false
}

document.addEventListener('keydown', function(e) {
	switch (e.keyCode) {
		case 65: // A
			movement.left = true;
			break;
		case 87: // W
			movement.up = true;
			break;
		case 68: // D
			movement.right = true;
			break;
		case 83: // S
			movement.down = true;
			break;
	}
});

document.addEventListener('keyup', function(e) {
	switch (e.keyCode) {
		case 65: // A
			movement.left = false;
			break;
		case 87: // W
			movement.up = false;
			break;
		case 68: // D
			movement.right = false;
			break;
		case 83: // S
			movement.down = false;
			break;
	}
});

// Send player's name when new player join
socket.emit('new player', playerName);

// Send User Input per 1/60 second
setInterval(function() {
	socket.emit('movement', movement);
}, 1000/60);

// Render game status
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext('2d');
socket.on('state', function(players) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'green';
	for (var id in players) {
		var player = players[id];
		ctx.beginPath();
		ctx.arc(player.x, player.y, 10, 0, 2*Math.PI);
		ctx.fill();
	}
});