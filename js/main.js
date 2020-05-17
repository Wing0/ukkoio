function initialise(width, height, stick) {
	// Creating the viewport elements

	for (var y = 0; y < height; y++) {
		var row = $('<div class="row" id="' + y + '"></div>');
		for (var x = 0; x < width; x++) {
			var blockContainer = $('<div class="tile" id="' + x + "-" + y + '"></div>');
			row.append(blockContainer);
		}
		$("#game-field").append(row);

		$("#game-overlay").append($('<dif id="stick" style="top:0; left:0;"></div>'));
	}


	// Binding the keys
	document.onkeydown = function(e) {
		console.log(e.which)
	    switch(e.which) {
	        case 37: // left
	        case 65: // left
	        validMoveStick(-1, 0, stick);
	        break;

	        case 38: // up
	        case 87: // up
	        validMoveStick(0, -1, stick);
	        break;

	        case 39: // right
	        case 68: // right
	        validMoveStick(1, 0, stick);
	        break;

	        case 40: // down
	        case 83: // down
	        validMoveStick(0, 1, stick);
	        break;

	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	};

}

function generateMap(width, height) {
	// Generating the data for the entire map

	console.log("Generating the map...")
	
	// Fill the map with empty tiles
	var game = [];
	for (var x = 0; x < width; x++) {
		game.push(new Array(height).fill("empty"))
	}

	// Data for the distribution of each tile
	var tiles = {
		"gold-one": {
			b: 5,
			p: 30,
			e: 35
		}
	};

	// Generating the map
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (y < 4) {
				game[x][y] = 'empty';
			} else {
				var rnd = Math.random();
				var inc = 0;
				
				for (var t in tiles){

					if (y > tiles[t].b && y < tiles[t].e) {
						console.log(inc, )
						if (inc + rnd < (Math.sin((y - tiles[t].b)/(tiles[t].e - tiles[t].b)*Math.PI*2)+0.5) * tiles[t].p/100) {
							game[x][y] = 'gold-one';
							inc += tiles[t].p
							continue
						}
					}
					game[x][y] = 'basic';
				}
			}
		}
	}

	return game;
}

function drawMap() {
	// Fill the viewport elements with the right content based on the map

	for (var x = 0; x < game.length; x++) {
		for (var y = 0; y < game[x].length; y++) {
			$('#' + x + "-" + y).html(sprites[game[x][y]].split(" ").join("&nbsp"))
		}
	};
}

function drawStick(stick) {
	// Drawing the adventurer over the map in its own container

	$("#stick").html(sprites["stick-basic"].split(" ").join("&nbsp"));
	var pos = $('#' + stick.x + "-" + stick.y).position();
	$("#stick").css({
		left: pos.left,
		top: pos.top
	})
}

function moveStick(x, y, stick) {
	// Perform the movement
	stick.x += x;
	stick.y += y;
	drawStick(stick)
}

function environmentCheckStick(stick) {
	if (game[stick.x][stick.y + 1] == "empty") {
		moveStick(0, 1, stick)
		environmentCheckStick(stick)
	}
}

function validMoveStick(x, y, stick) {
	// Validate the movement before moving

	if (game[stick.x + x][stick.y + y] == "empty") {
		if (y < 0){
			if (!stick.jump){
				return;
			}
		}
		moveStick(x, y, stick)
		environmentCheckStick(stick)
	}


}

// Run the game
game = generateMap(10, 10);
var stick = {
	x: 1,
	y: 1,
	jump: false
}
initialise(10, 10, stick);
console.log(game)
drawMap();
drawStick(stick);
environmentCheckStick(stick)


