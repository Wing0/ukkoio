function initialise(width, height, stick) {
	// Creating the viewport elements
	$("#game-field").html("");
	for (var y = -1; y < height + 1; y++) {
		var row = $('<div class="row" id="' + y + '"></div>');
		for (var x = -1; x < width + 1; x++) {
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
	        if (! gameData.shop[0]){
	        	selectMove(-1, 0, stick);
	        }
	        break;

	        case 38: // up
	        case 87: // up
	        if (! gameData.shop[0]){
	        	selectMove(0, -1, stick);
	        } else {
	        	selectItem(-1);
	        }
	        break;

	        case 39: // right
	        case 68: // right
	        if (! gameData.shop[0]){
	        	selectMove(1, 0, stick);
	        }
	        break;

	        case 40: // down
	        case 83: // down
	        if (! gameData.shop[0]){
	        	selectMove(0, 1, stick);
	        } else {
	        	selectItem(1);
	        }
	        break;

	        case 13: // Enter
	        if (gameData.shop[0]){
	        	buyItem();
	        }
	        break;

	        case 9: // TAB
	        toggleShop();
	        break;

	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	};

}

function generateMap(width, height) {
	// Generating the data for the entire map

	console.log("Generating the map...")

	generationData = [
		["empty", 0, 0, 4, 'filler'],
		["basic", 4, 0, 40, 'filler'], // tile type, start, peak frequency, end, interpolation method
		["gold-one", 5, 18, 40, 'sin'],
		["hard-one", 40, 0, 80, 'filler'],
		["hard-one-gold-three", 40, 10, 100, 'linear'],
		["gold-three", 30, 10, 80, 'sin'],
		["gold-five", 50, 3, 100, 'linear'],
		["empty", 70, 30, 100, 'sin'],
		["hard-five", 80, 0, 100, 'filler'],
		["hard-ten", 50, 30, 150, 'linear'],
        ["chest", 5, 0.4, 100, 'uniform'],
	]
	
	// Fill the map with empty tiles
	var game = [];
	for (var x = 0; x < width; x++) {
		game.push(new Array(height).fill("empty"))
	}

	// Generating the map
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var rnd = Math.random();
			var inc = 0;
			var found = false;

			// Check which non-filler blocks apply
			for (var i = 0; i < generationData.length; i++) {
				if (y >= generationData[i][1] && y < generationData[i][3] && generationData[i][4] != 'filler') {
					console.log(y, generationData[i][0])
					var p = 0; // If rnd is smaller than the expected propability p, create the special tile
					switch (generationData[i][4]) {

						case 'sin':
						p = (Math.sin((y - generationData[i][1])/(generationData[i][3] - generationData[i][1])*Math.PI*2 - Math.PI/2)+1) * generationData[i][2]/100
						if (rnd < inc + p) {
							game[x][y] = generationData[i][0];
							found = true;
						}
						break;
						
						case 'linear':
						p = (y - generationData[i][1])/(generationData[i][3] - generationData[i][1]) * generationData[i][2]/100
						if (rnd < inc + p) {
							game[x][y] = generationData[i][0];
							found = true;
						}
						break;
						
						case 'uniform':
						p = generationData[i][2]/100
						if (rnd < inc + p) {
							game[x][y] = generationData[i][0];
							found = true;
						}
						break;

					}
					inc += p
					if (found) {
						console.log("placed!")
						break;
					}
				}
			}
			// Use the matching filler block if no block placed
			if (!found) {
				for (var i = 0; i < generationData.length; i++) {
					if (y >= generationData[i][1] && y < generationData[i][3] && generationData[i][4] == 'filler') {
						game[x][y] = generationData[i][0];
						break;
					}
				}
			}
		}
	}

	return game;
}

function drawMap() {
	// Fill the viewport elements with the right content based on the map

	for (var x = -1; x < gameData.view[0] + 1; x++) {
		for (var y = -1; y < gameData.view[1] + 1; y++) {
			drawTile(x, y);
		}
	};
	$("#game-field").css({
		left: "-" + $("#0-0").css("width"),
		top: "-" + $("#0-0").css("height")
	})
	$("#game-field-container").css({
		width: parseInt($("#game-field").width(), 10) - 2 * parseInt($("#0-0").css("width"), 10) + "px",
		height: parseInt($("#game-field").height(), 10) - 2 * parseInt($("#0-0").css("height"), 10) + "px"
	});
}

function drawTile(v_x, v_y) {
	//  X and Y are in view port coordinates!
	// Draw the tile on the map to update, or re-draw
	if (v_x + gameData.view[2] < 0 || v_x + gameData.view[2] >= game.length || v_y + gameData.view[3] < 0 || v_y + gameData.view[3] >= game[0].length) {
		$('#' + v_x + "-" + v_y).html(sprites["empty"].split(" ").join("&nbsp"))	
	} else {
		$('#' + v_x + "-" + v_y).html(sprites[game[v_x + gameData.view[2]][v_y + gameData.view[3]]].split(" ").join("&nbsp"))	
	}
	
}

function drawStick(stick, pose) {
	// Drawing the adventurer over the map in its own container
	$("#stick").html(sprites[gameData.stick.pose].split(" ").join("&nbsp"));
	var x = stick.x - gameData.view[2];
	var y = stick.y - gameData.view[3];
	var pos = $('#' + x + "-" + y).position();
	$("#stick-container").css({ // Potential conflict with move animations...
		left: pos.left + $("#game-field").position().left + $("#game-field-container").position().left,
		top: pos.top + $("#game-field").position().top + $("#game-field-container").position().top
	})
}

function environmentCheckStick(stick) {
	if (stick.y < game[stick.x].length - 1 && game[stick.x][stick.y + 1] == "empty") {
		
		// Stick falling animation
		var fallDuration = 300;
		var distance = parseInt($("#0-0").css("height"), 10)
		var x_offset = Math.round(gameData.view[0]/2) - 1;
		var y_offset = Math.round(gameData.view[1]/2) - 1;

		gameData.stick.pose = "stick-fall";
		gameData.last_move = [0, 1];
		drawStick(stick)
		y = 1

		// If the stick is close to the edge, move that instead of the level
		if (stick.y < y_offset + 1 && y < 0 || stick.y < y_offset && y > 0 || stick.y > game[0].length - y_offset - 2 && y > 0 || stick.y > game[0].length - y_offset -1 && y < 0) {
			if (y < 0) {
				dto = true;
				$("#stick-container").animate({
					top: $("#stick-container").position().top - distance + "px",
				}, fallDuration, function(){
					gameData.stick.pose = "stick-basic";
					moveStick(0, y, stick)
					dto = false;
					environmentCheckStick(stick)
				})
			} 
			if (y > 0) {
				dto = true;
				$("#stick-container").animate({
					top: $("#stick-container").position().top + distance + "px",
				}, fallDuration, function(){
					gameData.stick.pose = "stick-basic";
					moveStick(0, y, stick)
					dto = false;
					environmentCheckStick(stick)
				})
			} 
		} else {
			// Level movement animation
			dto = true;
			$("#game-field").animate({
				top: $("#game-field").position().top - distance + "px",
			}, fallDuration, function(){
				$("#game-field").css({top: distance + "px"});
				gameData.stick.pose = "stick-basic";
				moveStick(0, y, stick)
				dto = false;
				environmentCheckStick(stick)
			})
		}
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

			var moveDuration = 800 / gameData.stick.shoes;
			gameData.last_move = [x, y];
			if (x > 0) {
				gameData.stick.pose = "stick-right";	
			}

			if (x < 0) {
				gameData.stick.pose = "stick-left";	
			}
			drawStick(stick);

			// Stick returns normal once movement complete
			dto = setTimeout(function(){
				gameData.last_move = [0, 0]
				gameData.stick.pose = "stick-basic";
				moveStick(x, y, stick)
				drawStick(stick)
				updateUI()
				environmentCheckStick(stick);
			}, moveDuration);


			// Calculate animation

			var distance = parseInt($("#0-0").css("width"), 10)
			var x_offset = Math.round(gameData.view[0]/2) - 1;
			var y_offset = Math.round(gameData.view[1]/2) - 1;

			// If the stick is close to the edge, move that instead of the level
			if (stick.x < x_offset + 1 && x < 0 || stick.x < x_offset && x > 0 || stick.x > game.length - x_offset - 2 && x > 0 || stick.x > game.length - x_offset -1 && x < 0) {
				if (x < 0) {
					$("#stick-container").animate({
						left: $("#stick-container").position().left - distance + "px",
					}, moveDuration)
				} 
				if (x > 0) {
					$("#stick-container").animate({
						left: $("#stick-container").position().left + distance + "px",
					}, moveDuration)
				} 
			} else {

				// Level movement animation
				if (x < 0) {
					$("#game-field").animate({
						left: $("#game-field").position().left + distance + "px",
					}, moveDuration, function(){
						$("#game-field").css({left: -distance + "px"});
					})

					tto = setTimeout(function(){

					}, moveDuration)
				} 
				if (x > 0) {
					$("#game-field").animate({
						left: $("#game-field").position().left - distance + "px",
					}, moveDuration, function(){
						$("#game-field").css({left: -distance + "px"});
					})
				}
			}
		}
	}
}

function moveStick(x, y, stick) {
	// Perform the movement
	stick.x += x;
	stick.y += y;
	updateUI()
	drawStick(stick)
}

function dig(x, y, stick) {
	// The stick man will dig the tile in that direction
	var tileType = game[stick.x + x][stick.y + y];
	switch (tileType) {
		default:
			if (x > 0) {
				gameData.stick.pose = "stick-dig-right";
				drawStick(stick);
			}
			if (y > 0) {
				gameData.stick.pose = "stick-dig-down";
				drawStick(stick);
			}
			if (x < 0) {
				gameData.stick.pose = "stick-dig-left";
				drawStick(stick);
			}
			if (y < 0) {
				gameData.stick.pose = "stick-dig-up";
				drawStick(stick);
			}
			gameData.last_move = [x, y];
			dto = setTimeout(function(){
				game[stick.x + x][stick.y + y] = "empty";
				if (stick.money == 0 && gameData.tiles[tileType].m > 0) {
					say("Ooh, moneys!")
				}
				stick.score += gameData.tiles[tileType].s;
				stick.money += gameData.tiles[tileType].m;
				gameData.last_move = [0, 0]
				var v_x = stick.x - gameData.view[2] + x;
				var v_y = stick.y - gameData.view[3] + y;
				drawTile(v_x, v_y)
				gameData.stick.pose = "stick-basic";
				drawStick(stick)
				updateUI()
				environmentCheckStick(stick);
			}, gameData.tiles[tileType].h / stick.shovel * 1000);
		break;
	}
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

	if (gameData.last_move[0] != 0 || gameData.last_move[1] != 0) {
		if (dto) {
			return;
		}
	}
	
	if (game[stick.x + x][stick.y + y] == "empty") {
		if (x > 0) {
		}
		validMoveStick(x, y, stick);
	} else {
		dig(x, y, stick);
	}
}

function updateUI() {
	// This function updates the changes in the game data in the UI

	// Score & money
	$("#score-display").html(gameData.stick.score);
	$("#money-display").html(gameData.stick.money);
	$("#location-display").html("(" + gameData.stick.x + ", " + gameData.stick.y + ")");

	// Level transition
	var x_offset = Math.round(gameData.view[0]/2) - 1;
	var y_offset = Math.round(gameData.view[1]/2) - 1;
	var step = 0;
	if (gameData.stick.x > x_offset - 1 && gameData.stick.x < game.length - x_offset && gameData.stick.x - gameData.view[2] != x_offset) {
		step = (gameData.stick.x - x_offset) - gameData.view[2];
		gameData.view[2] = Math.min(game.length - gameData.view[0], gameData.view[2] + step);
		drawMap()
		drawStick(gameData.stick)
	}
	if (gameData.stick.y > y_offset && gameData.stick.y < game[0].length - y_offset && gameData.stick.y - gameData.view[3] != y_offset) {
		step = (gameData.stick.y - y_offset) - gameData.view[3];
		gameData.view[3] = Math.min(game[0].length - gameData.view[1], gameData.view[3] + step);
		drawMap()
		drawStick(gameData.stick)
	}

	// Update the health bar
	var hearts = Math.floor(gameData.stick.health / 20)
	$("#health-container").html("")
	for (var i = 0; i < hearts; i++) {
		$("#health-container").append($('<span class="health on">♥</span>'));
	}
	
	for (var i = 0; i < Math.round(gameData.stick.max_health / 20) - hearts; i++) {
		$("#health-container").append($('<span class="health off">♥</span>'));
	}
}

function toggleShop() {
	// body...
	if ($("#game-field-wrapper").is(":visible")) {
		$("#stick-container").fadeOut(200);
		$("#game-field-wrapper").fadeOut(200, function(){
			$("#game-store").fadeIn();
			updateShop();
			gameData.shop[0] = true;
		});
		
	} else {	
		$("#game-store").fadeOut(200, function(){
			$("#game-field-wrapper").fadeIn();	
			$("#stick-container").fadeIn(200);
			drawMap()
			drawStick(gameData.stick);
		});
		gameData.shop[0] = false;
	}
	
}

function updateShop() {
	// body...
	$("#store-shovel>.price").html(Math.round(gameData.upgrades.shovel[1]*1.5**gameData.upgrades.shovel[0]));
	$("#store-shoes>.price").html(Math.round(gameData.upgrades.shoes[1]*1.5**gameData.upgrades.shoes[0]));
	$("#store-sight>.price").html(gameData.upgrades.sight[1][gameData.upgrades.sight[0] + 1][0]);
	updateUI();
}

function selectItem(direction) {
	// Move the item slector
	gameData.shop[1] += direction;
	gameData.shop[1] = Math.max(0, gameData.shop[1])
	gameData.shop[1] = Math.min($(".selector").length - 1, gameData.shop[1])
	$(".selected").removeClass("selected");
	$(".selector:eq("+gameData.shop[1]+")").addClass("selected");
}


function buyItem() {
	switch (gameData.shop[1]) {
		case 0:
		var cost = Math.round(gameData.upgrades.shovel[1]*1.5**gameData.upgrades.shovel[0]);
		if (gameData.stick.money >= cost) {
			gameData.upgrades.shovel[0] += 1;
			gameData.stick.shovel *= 1.3;
			gameData.stick.money -= cost;
			$(".selector:eq("+gameData.shop[1]+")").addClass("chosen");
			updateShop();
			setTimeout(function(){
				$(".chosen").removeClass("chosen");
			}, 1500)
		}
		break;

		case 1:
		var cost = gameData.upgrades.sight[1][gameData.upgrades.sight[0] + 1][0];
		if (gameData.stick.money >= cost) {
			gameData.upgrades.sight[0] += 1;
			gameData.stick.money -= cost;
			gameData.view[0] += gameData.upgrades.sight[1][gameData.upgrades.sight[0]][1];
			gameData.view[1] += gameData.upgrades.sight[1][gameData.upgrades.sight[0]][2];
			$(".selector:eq("+gameData.shop[1]+")").addClass("chosen");
			updateShop();
			initialise(gameData.view[0], gameData.view[1], gameData.stick)
			setTimeout(function(){
				$(".chosen").removeClass("chosen");
			}, 1500)
		}
		break;

		case 2:
		var cost = Math.round(gameData.upgrades.shoes[1]*1.5**gameData.upgrades.shoes[0]);
		if (gameData.stick.money >= cost) {
			gameData.upgrades.shoes[0] += 1;
			gameData.stick.shoes *= 1.3;
			gameData.stick.money -= cost;
			$(".selector:eq("+gameData.shop[1]+")").addClass("chosen");
			updateShop();
			setTimeout(function(){
				$(".chosen").removeClass("chosen");
			}, 1500)
		}
		break;
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

// Run the game

var gameData = {
	// Data for the distribution of each tile
	tiles: {
		"basic": {
			s: 1,
			m: 0,
			h: 1
		},
		"gold-one": {
			s: 5,
			m: 1,
			h: 1
		},
		"hard-one": {
			s: 5,
			m: 0,
			h: 2
		},
		"hard-one-gold-three": {
			s: 20,
			m: 3,
			h: 2
		},
		"hard-five": {
			s: 15,
			m: 0,
			h: 5
		},
		"gold-three": {
			s: 15,
			m: 3,
			h: 1
		},
		"gold-five": {
			s: 25,
			m: 5,
			h: 1
		}, 
		"hard-ten": {
			s: 25,
			m: 0,
			h: 10
		},
        "chest": {
            s: 100,
            m: 50,
            h: 2
        },
	},
	stick: {
		x: 5,
		y: 3,
		jump: false,
		shovel: 1,
		score: 0,
		money: 0,
		health: 100,
		max_health: 100,
		pose: "stick-basic",
		shoes: 1
	},
	view: [5, 5, 3, 2],
	shop: [false, 0],
	upgrades: {
		shovel: [1, 5], // Current level, starting cost
		shoes: [1, 8], // Current level, starting cost
		sight: [
			0, [ // Level
				[0, 0, 0],
				[10, 1, 0], // cost, x improvement, y improvement
				[20, 0, 1],
				[40, 1, 0],
				[100, 1, 1],
				[200, 0, 1],
				[400, 1, 0],
				[1000, 1, 1]
			]
		]
	},
	last_move: [0, 0]
}

game = generateMap(20, 100);
initialise(gameData.view[0], gameData.view[1], gameData.stick);
var dto = false;
console.log(game)
drawMap(gameData.view);
updateUI()
drawStick(gameData.stick);
environmentCheckStick(gameData.stick)
say("Where am I? What is this place?")

