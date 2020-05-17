function initialise(argument) {
	var vLocation = [0,0]
	var game = [];

	for (var x = 0; x < 10; x++) {
		var lst = [];
		for (var y = 0; y < 10; y++) {
			lst.push("basic")
		}
		game.push(lst)
	}


	for (var x = 0; x < game.length; x++) {
		var row = $('<div class="row" id="' + y + '"></div>');
		for (var y = 0; y < game[x].length; y++) {
			var blockContainer = $('<div class="tile" id="' + x + "-" + y + '"></div>');
			row.append(blockContainer);
		}
		$("#game-field").append(row);
	}


	$(".tile").each(function() {
		$(this).append(sprites["basic"].split(" ").join("&nbsp"))
	});
}

function generateMap(width, hight) {
	
}

function drawMap(argument) {
	// body...
}
