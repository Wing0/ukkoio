function initialise(width, height, stick) {
	// Creating the viewport elements

	for (var y = 0; y < height; y++) {
		var row = $('<div class="row" id="' + y + '"></div>');
		for (var x = 0; x < width; x++) {
			var blockContainer = $('<div class="tile" id="' + x + "-" + y + '"></div>');
			row.append(blockContainer);
		}
		$("#game-field").append(row);

		$("#game-overlay").append($('<dif id="stick-container" style="top:0; left:0;"></div>'));
		$("#stick-container").append($('<dif id="stick"></div>'));
		$("#stick-container").append($('<dif id="message" style="display: none; position: absolute; bottom:110%; left:-2.5em;"></div>'));
	}


	// Binding the keys
	document.onkeydown = function(e) {
		console.log(e.which)
	    switch(e.which) {
	        case 37: // left
	        case 65: // left
	        selectMove(-1, 0, stick);
	        break;

	        case 38: // up
	        case 87: // up
	        selectMove(0, -1, stick);
	        break;

	        case 39: // right
	        case 68: // right
	        selectMove(1, 0, stick);
	        break;

	        case 40: // down
	        case 83: // down
	        selectMove(0, 1, stick);
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

	// Generating the map
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (y < 4) {
				game[x][y] = 'empty';
			} else {
				var rnd = Math.random();
				var inc = 0;
				
				for (var t in gameData.tiles){

					if (gameData.tiles[t].distribute && y > gameData.tiles[t].b && y < gameData.tiles[t].e) {
						console.log(inc, )
						if (inc + rnd < (Math.sin((y - gameData.tiles[t].b)/(gameData.tiles[t].e - gameData.tiles[t].b)*Math.PI*2)+0.5) * gameData.tiles[t].p/100) {
							game[x][y] = 'gold-one';
							inc += gameData.tiles[t].p
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
			drawTile(x, y);
		}
	};
}

function drawTile(x, y) {
	// Draw the tile on the map to update, or re-draw
	console.log(x, y, game[x][y])
	$('#' + x + "-" + y).html(sprites[game[x][y]].split(" ").join("&nbsp"))
}

function drawStick(stick) {
	// Drawing the adventurer over the map in its own container

	$("#stick").html(sprites["stick-basic"].split(" ").join("&nbsp"));
	var pos = $('#' + stick.x + "-" + stick.y).position();
	$("#stick-container").css({
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
	if (stick.x < game.length - 1 && stick.y < game[stick.x].length - 1 && game[stick.x][stick.y + 1] == "empty") {
		moveStick(0, 1, stick)
		environmentCheckStick(stick)
	}
}

function validMoveStick(x, y, stick) {
	// Validate the movement before moving
	if (stick.x <= game.length - 1 && stick.y <= game[stick.x].length - 1) {
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
}

function dig(x, y, stick) {
	// The stick man will dig the tile in that direction
	var tileType = game[stick.x + x][stick.y + y];
	switch (tileType) {
		case "basic":
		case "gold-one":
			game[stick.x + x][stick.y + y] = "empty";
			if (stick.money == 0 && gameData.tiles[tileType].m > 0) {
				say("Ooh, moneys!")
			}
			stick.score += gameData.tiles[tileType].s;
			stick.money += gameData.tiles[tileType].m;
		break;
	}
	drawTile(stick.x + x, stick.y + y)
	updateUI()
	environmentCheckStick(stick);
}

function selectMove(x, y, stick) {
	// 
	if (stick.x == game.length - 1 && x > 0) {
		say("O-o-oou, cannot go further", "warning")
		return;
	}
	if (stick.y == game[stick.x].length - 1 && y > 0) {
		say("O-o-oou, cannot go further", "warning")
		return;
	}
	if (stick.x == 0 && x < 0) {
		say("O-o-oou, cannot go further", "warning")
		return;
	}
	if (stick.y == 0 && y < 0) {
		say("O-o-oou, cannot go further", "warning")
		return;
	}
	if (game[stick.x + x][stick.y + y] == "empty") {
		validMoveStick(x, y, stick);
	} else {
		dig(x, y, stick);
	}
}

function updateUI(argument) {
	// This function updates the changes in the game data in the UI

	$("#score-display").html(gameData.stick.score);
	$("#money-display").html(gameData.stick.money);
}

// Run the game

var gameData = {
	// Data for the distribution of each tile
	tiles: {
		"basic": {
			distribute: false,
			s: 1,
			m: 0
		},
		"gold-one": {
			distribute: true,
			b: 5,
			p: 30,
			e: 35,
			s: 5,
			m: 1
		}
	},
	stick: {
		x: 1,
		y: 1,
		jump: false,
		shovel: 1,
		score: 0,
		money: 0
	}
}

function say(message, level) {
	// The stick man will say the message as a feedback
	$("#message").html(message);
	var severity = 1
	switch (level) {

		case "info":
			$("#message").css({"background-color": "white"});
			break;

		case "warning":
			$("#message").css({"background-color": "yellow"});
			severity = 1.5
			break;
		default:
			$("#message").css({"background-color": "white"});
			break;
	}
	$("#message").fadeIn(200);
	setTimeout(function() {
		$("#message").fadeOut(1000);
	}, message.length * 100 * severity)
	

}

game = generateMap(10, 10);

initialise(10, 10, gameData.stick);
console.log(game)
drawMap();
drawStick(gameData.stick);
environmentCheckStick(gameData.stick)
updateUI()
say("Welcome!")

