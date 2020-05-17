function initialise(width, height) {
	// Creating the viewport elements

	for (var y = 0; y < height; y++) {
		var row = $('<div class="row" id="' + y + '"></div>');
		for (var x = 0; x < width; x++) {
			var blockContainer = $('<div class="tile" id="' + x + "-" + y + '"></div>');
			row.append(blockContainer);
		}
		$("#game-field").append(row);
	}

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

// Run the game
game = generateMap(10, 10);
initialise(10, 10);
console.log(game)
drawMap();