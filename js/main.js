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
		$("#stick-container").append($('<dif id="move-down" class="arrow" style="display: none; position: absolute; top:90%; right:40%; transform: rotate(90deg);">➔</div>'));
		$("#stick-container").append($('<dif id="move-timer"  style="display: none; color: white; border-radius: 30px; padding: 0 5px 0 5px; position: absolute; top:105%; right:65%;"><span id="timer-display" style="background-color: none;">3</span></div>'));

	}
}

function bindKeys() {
	// Binding the keys

	document.onkeydown = function(e) {
		console.log(e.which)
		switch (gameData.mode) {
			case "game":
			if (gameData.alive) {
				console.log("Bound to game")
				switch(e.which) {
			        case 37: // left
			        case 65: // left
		        	selectMove(-1, 0, gameData.stick);
			        break;

			        case 38: // up
			        case 87: // up
		        	selectMove(0, -1, gameData.stick);
			        break;

			        case 39: // right
			        case 68: // right
		        	selectMove(1, 0, gameData.stick);
			        break;

			        case 40: // down
			        case 83: // down
		        	selectMove(0, 1, gameData.stick);
			        break;

			        case 81: // Q
			        case 69: // E
			        useSkill(e.which);
			        break;

			        case 9: // TAB
			        toggleShop(true);
			        break;

			        default: return; // exit this handler for other keys
			    }
			    e.preventDefault(); // prevent the default action (scroll / move caret)
			}
		    break;

			case "shop":
			switch(e.which) {

		        case 38: // up
		        case 87: // up
	        	selectItem(-1);
		        break;

		        case 40: // down
		        case 83: // down
	        	selectItem(1);
		        break;

		        case 13: // Enter
	        	chooseItem();
		        break;

		        case 9: // TAB
		        toggleShop(false);
		        break;

		        default: return; // exit this handler for other keys
		    }
		    e.preventDefault(); // prevent the default action (scroll / move caret)
		    break;

			case "menu":
			switch(e.which) {

		        case 38: // up
		        case 87: // up
	        	selectItem(-1);
		        break;

		        case 40: // down
		        case 83: // down
	        	selectItem(1);
		        break;

		        case 13: // Enter
	        	chooseItem();
		        break;

		        default: return; // exit this handler for other keys
		    }
		    break;

		    case "over":
			switch(e.which) {
		        case 9: // TAB
		        case 32: // SPACE
		        case 13: // Enter
			    $("#game").hide()
			    $("#start").show()
				$("#game-container").fadeIn(1000);

				$("#game-wrapper").animate({
					"background-color": "white"
				}, {easing: "swing", duration: 1000});
				gameData.mode = "menu"
			    break;
			}
		}
	};
}

function gameOver() {
	clearTimeout(deather)
	resetTimer(true);
	gameData.alive = false;
	gameData.mode = "over";
	$("#game-container").fadeOut();
	$("#game-over").fadeIn();
	$("#game-wrapper").animate({
		"background-color": "black"
	}, {easing: "linear", duration: 1000});
	$("#game-over").append('<div id="end-score">Your score: ' + gameData.stick.score + " in " + gameData.gameMode + " mode</div>")
	$("#game-over").append('<div id="return-to-menu">Press &lt;TAB&gt; or &lt;SPACE&gt; to return to main menu</div>')
}

function generateMap(width, height) {
	// Generating the data for the entire map

	console.log("Generating the map...")

	generationData = [
		["empty", 0, 0, 4, 'filler'],
		["basic", 4, 0, 40, 'filler'], // tile type, start, peak frequency, end, interpolation method
		["gold-one", 0, 18, 40, 'sin'],
		["hard-one", 40, 0, 80, 'filler'],
		["hard-one-gold-three", 40, 10, 100, 'linear'],
		["gold-three", 30, 10, 80, 'sin'],
		["gold-five", 50, 3, 100, 'linear'],
		["empty", 70, 30, 100, 'sin'],
		["hard-five", 80, 0, 100, 'filler'],
		["hard-ten", 50, 20, 100, 'linear'],
        ["chest", 5, 0.3, 100, 'uniform'],
        ["worm-base", 40, 0.8, 100, 'uniform'],
        ["worm-base", 90, 5, 150, 'linear'],
        ["worm-vertical-base", 120, 8, 180, 'linear'],
		["gold-five", 120, 5, 150, 'uniform'],
		["hard-ten", 100, 0, 150, 'filler'],
		["empty", 90, 20, 150, 'uniform'],
        ["chest-2", 90, 0.4, 150, 'uniform'],
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

function drawAbsoluteTile(x, y) {
	//  X and Y are in absolute coordinates!
	// Draw the tile on the map to update, or re-draw
	var v_x = x - gameData.view[2];
	var v_y = y - gameData.view[3];
	if (v_x >= -1 && v_x <= gameData.view[1] && v_y >= -1 && v_y <= gameData.view[2]){
		drawTile(v_x, v_y)
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
		gameData.stick.fallDistance += 1;
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
	} else {
		if (gameData.stick.fallDistance > 1) {
			var dmg = (gameData.stick.fallDistance - 1) ** 2 * 10;
			doDamage(dmg);
		}
		gameData.stick.fallDistance = 0;
	}

	// Monster check

	// Horizontal worm
	for (var i = -3; i <= 3; i++) {
		if (stick.x + i >= 0 && stick.x + i < game.length && game[stick.x + i][stick.y] == "worm-base") {
			switch (i) {
				
				case 1:
				case -1:
				doDamage(40);
				game[stick.x + i][stick.y] = "worm-head-used";
				break;

				case 2:
				case -2:
				doDamage(20);
				game[stick.x + i][stick.y] = "worm-base-used";
				game[stick.x + i/2][stick.y] = "worm-head";
				break;

				case 3:
				case -3:
				doDamage(10);
				game[stick.x + i][stick.y] = "worm-base-used";
				game[stick.x + i - i/3][stick.y] = "worm-body";
				game[stick.x + i/3][stick.y] = "worm-head";
				break;
			}
		}
	}

	// Vertical worm
	for (var i = -3; i <= 3; i++) {
		if (stick.y + i >= 0 && stick.y + i < game[0].length && game[stick.x][stick.y + i] == "worm-vertical-base") {
			switch (i) {
				
				case 1:
				case -1:
				doDamage(50);
				game[stick.x][stick.y + i] = "worm-vertical-head-used";
				break;

				case 2:
				case -2:
				doDamage(30);
				game[stick.x][stick.y + i] = "worm-vertical-base-used";
				game[stick.x][stick.y + i/2] = "worm-vertical-head";
				break;

				case 3:
				case -3:
				doDamage(25);
				game[stick.x][stick.y + i] = "worm-vertical-base-used";
				game[stick.x][stick.y + i - i/3] = "worm-vertical-body";
				game[stick.x][stick.y + i/3] = "worm-vertical-head";
				break;
			}
		}
	}
	drawMap();
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
			if (gameData.view[0] % 2) {
				var x_offset = Math.round(gameData.view[0]/2) - 1;
			} else {
				var x_offset = Math.round(gameData.view[0] / 2);
			}
			var y_offset = Math.round(gameData.view[1]/2) - 1;

			// If the stick is close to the edge, move that instead of the level
			if (stick.x < x_offset + 1 && x < 0 || stick.x < x_offset && x > 0 || stick.x > game.length - x_offset - 2 && x > 0 || stick.x > game.length - x_offset - 1 && x < 0) {
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
	if (y > 0) {
		resetTimer()
	}
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
				switch (game[stick.x + x][stick.y + y]) {
					
					case "chest-2":
					stick.bombs += Math.round(Math.random()*5);
					stick.money += Math.round(Math.random()*50);

					case "chest":
					stick.money += Math.round(Math.random()*50);
					break;

					case "bomb":
					stick.bombs += 1
					bto = false;
					break;

				}
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
	// Slect what move to use (e.g. dig or move right)
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


function doDamage(dmg) {
	// Reduces the stick health
	var effectiveDmg = Math.max(0, dmg - gameData.stick.armor);
	gameData.stick.health -= effectiveDmg;
	updateUI()
	if (effectiveDmg > 0) {
		say("(≧︿≦)");	
	} else {
		say("¯\_(ツ)_/¯");
	}
	
	if (gameData.stick.health <= 0) {
		resetTimer(true);
		gameOver();
	}
}

function updateUI() {
	// This function updates the changes in the game data in the UI

	// Score & money
	$("#score-display").html(gameData.stick.score);
	$("#money-display").html(gameData.stick.money);
	$("#bomb .indicator").html(gameData.stick.bombs);
	$("#location-display").html("(" + gameData.stick.x + ", " + gameData.stick.y + ")");

	// Level transition when not close to the edge
	var x_offset = Math.round(gameData.view[0]/2) - 1;
	var y_offset = Math.round(gameData.view[1]/2) - 1;
	var step = 0;
	if (gameData.stick.x > x_offset - 1 && gameData.stick.x < game.length - x_offset && gameData.stick.x - gameData.view[2] != x_offset) {
		step = (gameData.stick.x - x_offset) - gameData.view[2];
		gameData.view[2] = Math.min(game.length - gameData.view[0], gameData.view[2] + step);
		drawMap()
		drawStick(gameData.stick)
	}
	if (gameData.stick.y > y_offset - 1 && gameData.stick.y < game[0].length - y_offset && gameData.stick.y - gameData.view[3] != y_offset) {
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
	
	for (var i = 0; i < Math.round(gameData.stick.maxHealth / 20) - hearts; i++) {
		$("#health-container").append($('<span class="health off">♥</span>'));
	}
}

function increaseTimer() {
	// Death timer
	if (gameData.stick.score < 300 || gameData.gameMode == "casual") {
		return;
	}
	var tick = 1000;
	gameData.moveTimer += 1;
	if (gameData.moveTimer == gameData.moveTimerMax) {
		gameOver();
		return;
	}
	clearTimeout(deather);
	deather = setTimeout(increaseTimer, tick);

	console.log("Timer:", gameData.moveTimer)


	var color = 255;
	if (gameData.moveTimer >= gameData.moveTimerThreshold) {
		color = Math.round(255 - (gameData.moveTimer - gameData.moveTimerThreshold + 1) / (gameData.moveTimerMax - gameData.moveTimerThreshold) * 255);
		if (gameData.moveTimer - gameData.moveTimerThreshold < 1) {
			say("Hurry down!")	
			$("#move-down").fadeIn()
			$("#move-timer").fadeIn()
		}
		$("#timer-display").html(gameData.moveTimerMax - gameData.moveTimer - 1)


		$("#move-timer").animate({
			"background-color": "rgb(" + color + ", " + color + ", " + color + ")"
		}, {easing: "linear", duration: tick});
	}
	
}

function resetTimer(keep) {
	// body...
	if (! keep){
		gameData.moveTimer = Math.round(0.3 * gameData.moveTimer);
		clearTimeout(deather)
		increaseTimer()
		$("#move-down").hide()
		$("#move-timer").css({"background-color": "white", "display": "none"})
	} else {
		clearTimeout(deather)
	}
}

function toggleShop(on) {
	// body...
	if (on) {
		$("#stick-container").fadeOut(200);
		resetTimer(true);
		$("#game-field-wrapper").fadeOut(200, function(){
			$("#game-store").fadeIn();
			updateShop();
			gameData.mode = "shop";
		});
	} else {	
		$("#game-store").fadeOut(200, function(){
			$("#game-field-wrapper").fadeIn();	
			$("#stick-container").fadeIn(200);
			drawMap()
			drawStick(gameData.stick);
			increaseTimer()
		});
		gameData.mode = "game";
	}
}

function updateShop() {
	// body...
	$("#store-shovel>.price").html(Math.round(gameData.upgrades.shovel[1]*1.5**gameData.upgrades.shovel[0]));
	$("#store-shoes>.price").html(Math.round(gameData.upgrades.shoes[1]*1.5**gameData.upgrades.shoes[0]));
	$("#store-sight>.price").html(gameData.upgrades.sight[1][gameData.upgrades.sight[0] + 1][0]);
	$("#store-armor>.price").html(gameData.upgrades.armor[1][gameData.upgrades.armor[0] + 1][0]);
	updateUI();
}

function selectItem(direction) {
	// Move the item selector
	switch (gameData.mode) {
		case "shop":
		gameData.shop += direction;
		gameData.shop = Math.max(0, gameData.shop)
		gameData.shop = Math.min($("#game-store .selector").length - 1, gameData.shop)
		$("#game-store .selected").removeClass("selected");
		$("#game-store .selector:eq("+gameData.shop+")").addClass("selected");
		break;

		case "menu":
		gameData.menu += direction;
		gameData.menu = Math.max(0, gameData.menu)
		gameData.menu = Math.min($("#start .selector").length - 1, gameData.menu)
		$("#start .selected").removeClass("selected");
		$("#start .selector:eq("+gameData.menu+")").addClass("selected");
		break;
	}
}


function chooseItem() {
	switch (gameData.mode){

		case "shop":
		switch (gameData.shop) {
			case 0:
			var cost = Math.round(gameData.upgrades.shovel[1]*1.5**gameData.upgrades.shovel[0]);
			if (gameData.stick.money >= cost) {
				gameData.upgrades.shovel[0] += 1;
				gameData.stick.shovel *= 1.3;
				gameData.stick.money -= cost;
				$("#game-shop .selector:eq("+gameData.shop+")").addClass("chosen");
				updateShop();
				setTimeout(function(){
					$("#game-shop .chosen").removeClass("chosen");
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
				$("#game-shop .selector:eq("+gameData.shop+")").addClass("chosen");
				updateShop();
				initialise(gameData.view[0], gameData.view[1], gameData.stick)

				// Fixing a bug where the right side of the field is treated differently
				if (gameData.upgrades.sight[0] % 2 == 1) {
					if (gameData.view[2] + gameData.view[0] >= game.length) {
						gameData.view[2] -= 1
					}
				}
				drawMap();
				setTimeout(function(){
					$("#game-shop .chosen").removeClass("chosen");
				}, 1500)
			}
			break;

			case 2:
			var cost = Math.round(gameData.upgrades.shoes[1]*1.5**gameData.upgrades.shoes[0]);
			if (gameData.stick.money >= cost) {
				gameData.upgrades.shoes[0] += 1;
				gameData.stick.shoes *= 1.3;
				gameData.stick.money -= cost;
				$("#game-shop .selector:eq("+gameData.shop+")").addClass("chosen");
				updateShop();
				setTimeout(function(){
					$("#game-shop .chosen").removeClass("chosen");
				}, 1500)
			}
			break;

			case 3:
			var cost = gameData.upgrades.armor[1][gameData.upgrades.armor[0] + 1][0];
			if (gameData.stick.money >= cost) {
				gameData.upgrades.armor[0] += 1;
				gameData.stick.money -= cost;
				gameData.stick.armor += gameData.upgrades.armor[1][gameData.upgrades.armor[0]][1];
				$("#game-shop .selector:eq("+gameData.shop+")").addClass("chosen");
				updateShop();
				initialise(gameData.view[0], gameData.view[1], gameData.stick)
				setTimeout(function(){
					$("#game-shop .chosen").removeClass("chosen");
				}, 1500)
			}
			break;
		}
		break;

		case "menu":
		switch ($("#start .choice:eq("+gameData.menu+")").attr("data-id")) {
			
			case "arcade":
			startGame("arcade");
			break;
			
			case "casual":
			startGame("casual");
			break;
			
			case "controls":
			console.log("game ghelpd")
			$("#help").toggle()
			break;
		}
		break;
	}
	
}

function useSkill(btn) {
	// Uses the selected skill based on the button pressed
	if (btn == 81) {
		var shift = -1;
	} else {
		var shift = 1;
	}
	if (gameData.stick.bombs > 0){
		var out = false;
		var x = 0;
		var y = 0;

		if (game[gameData.stick.x + shift][gameData.stick.y] != "empty") {
			say("Cannot put it there...", "warning");
			return
		}

		out = dropCoordinates(gameData.stick.x + shift, gameData.stick.y)
		x = out[0]
		y = out[1]

		game[x][y] = "bomb";
		gameData.stick.bombs -= 1;
		drawAbsoluteTile(x, y)
		bto = setTimeout(function(){
			explosion(x, y, 2)
		}, 3000);
	}
}

function dropCoordinates(x, y) {
	if (game[x][y + 1] == "empty") {
		return dropCoordinates(x, y + 1);
	}
	return [x, y];
}

function explosion(x, y, size) {
	// Makes an explosion using x and y as origin
	console.log("BOOM!")
	say("BOOM!")
	for (var i = - size; i <= size; i ++) {
		if (x + i >= 0 && x + i < game.length) {
			game[x + i][y] = "empty";	
			// drawAbsoluteTile(x + i, y)
			if (gameData.stick.x == x + i && gameData.stick.y == y) {
				doDamage(50);
			}
		}
	}
	for (var i = - size; i <= size; i ++) {
		if (y + i >= 0 && y + i < game[0].length) {
			game[x][y + i] = "empty";	
			// drawAbsoluteTile(x, y + i)
			if (gameData.stick.x == x && gameData.stick.y == y + i) {
				doDamage(50);
			}
		}
	}
	drawMap()
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



function startGame(mode) {
	// Start the game
	gameData = {
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
	            m: 20,
	            h: 2
	        },
	        "chest-2": {
	            s: 200,
	            m: 20,
	            h: 5
	        },
	        "worm-base": {
	            s: 100,
	            m: 25,
	            h: 5
	        },
	        "worm-base-used": {
	            s: 50,
	            m: 15,
	            h: 3
	        },
	        "worm-body": {
	            s: 1,
	            m: 0,
	            h: 2
	        },
	        "worm-head": {
	            s: 5,
	            m: 0,
	            h: 3
	        },
	        "worm-head-used": {
	            s: 50,
	            m: 15,
	            h: 3
	        },
	        "worm-vertical-base": {
	            s: 200,
	            m: 50,
	            h: 10
	        },
	        "worm-vertical-base-used": {
	            s: 100,
	            m: 20,
	            h: 5
	        },
	        "worm-vertical-body": {
	            s: 1,
	            m: 0,
	            h: 2
	        },
	        "worm-vertical-head": {
	            s: 5,
	            m: 0,
	            h: 3
	        },
	        "worm-vertical-head-used": {
	            s: 100,
	            m: 20,
	            h: 5
	        },
	        "bomb": {
	            s: 0,
	            m: 0,
	            h: 0
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
			maxHealth: 100,
			pose: "stick-basic",
			shoes: 1,
			armor: 0,
			bombs: 0,
			fallDistance: 0
		},
		view: [5, 5, 3, 2],
		shop: 0, // selected index
		menu: 0,
		upgrades: {
			shovel: [1, 5], // Current level, starting cost
			shoes: [1, 8], // Current level, starting cost
			armor: [
				0, [ // Level
					[0, 0],
					[20, 5], // cost, armor
					[40, 10],
					[100, 20],
					[200, 30],
					[400, 40],
					[1000, 60]
				]
			],
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
		last_move: [0, 0],
		alive: true,
		moveTimer: 0,
		moveTimerMax: 20,
		moveTimerThreshold: 10,
		mode: "game", // Which view is active
		gameMode: mode // Which game mode is selected
	}

	$("#game-over").html("     ___________    <br>   / ___________\\        <br>  /  /<br> |  |                    _____       ___       ___   __________<br> |  |     _________     /     \\     |   \\    /   |  |   ______/   <br> |  |    /______  |    /  /_\\  \\    |    \\__/    |  |  |_______   <br> \\  \\          / /    /  _____  \\   |  |\\____/|  |  |   ______/ <br>  \\  \\________/ /    /  /     \\  \\  |  |      |  |  |  |_______  <br>   \\ __________/    /  /       \\  \\ |  |      |  |  |_________/  <br>       _________    <br>     /  _______  \\   <br>    /  /       \\  \\    <br>   |  |        |  |   __          ___    __________   ___   ____ <br>   |  |        |  |  \\  \\        /  /   |   ______/  |  | /  __|  <br>   |  |        |  |   \\  \\      /  /    |  |______   |  |  /      <br>   |  |        |  |    \\  \\    /  /     |   ______/  |   /  <br>    \\  \\______/  /      \\  \\__/  /      |  |         |  |   <br>     \\__________/        \\______/       |_________/  |__|      <br>".split(" ").join("&nbsp"));
	
	// Generate map & UI
	game = generateMap(20, 150);
	initialise(gameData.view[0], gameData.view[1], gameData.stick);
	var dto = false;
	var bto = false;
	var deather = false;
	resetTimer();
	$("#start").fadeOut(400, function(){
		$("#game").fadeIn(1000, function(){
			say("Where am I? What is this place?")
		});
		drawMap(gameData.view);
		updateUI()
		drawStick(gameData.stick);
		environmentCheckStick(gameData.stick)

		// Bug fix for the case where the stick spawns inside a block
		game[gameData.stick.x][gameData.stick.y] = "empty";
		drawAbsoluteTile(gameData.stick.x, gameData.stick.y);

		// Debug settings
		if (DEBUG) {
			gameData.stick.money = 5000;
			gameData.stick.score = 305;
			gameData.stick.bombs = 10;
		}
	})
}

var DEBUG = false;
var game = false;
var gameData = {
	mode: "menu",
	menu: 0
};
var deather = false;
bindKeys()