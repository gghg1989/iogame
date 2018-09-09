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
			movement.left = fa;
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