//Utilities
var getRandomColor = function() {
	var color = "#";
	for (var i=0; i<6; i++) {
		color += "0123456789abcdef"[Math.floor(Math.random()*16)];
	}
	return color;
};