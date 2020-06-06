var sprites = {
	"empty":
		"       <br>"+
		"       <br>"+
		"       ",
	"basic":
		"|`````|<br>"+
		"|     |<br>"+
		"|_____|",
	"gold-one":
		"|`````|<br>"+
		"|  0  |<br>"+
		"|_____|",
	"gold-three":
		"|`````|<br>"+
		"|  0  |<br>"+
		"|0___0|",
	"gold-five":
		"|0```0|<br>"+
		"|  0  |<br>"+
		"|0___0|",
	"hard-one":
		"|: : :|<br>"+
		": : : :<br>"+
		"|: : :|",
	"hard-one-gold-three":
		"|0 : 0|<br>"+
		"|: 0 :|<br>"+
		"|: : :|",
	"hard-five":
		"|+++++|<br>"+
		"|+++++|<br>"+
		"|+++++|",
	"hard-five-gold-five":
		"|0+++0|<br>"+
		"|++0++|<br>"+
		"|0+++0|",
	"hard-ten":
		"{|||||}<br>"+
		"{|||||}<br>"+
		"{|||||}",
	"solid":
		"{#####}<br>"+
		"{#####}<br>"+
		"{#####}",
	"stick-basic":
		"   O   <br>"+
		"  /|\\  <br>"+
		"  / \\  ",
	"stick-fall":
		" \\_O_/ <br>"+
		"   |   <br>"+
		"  / \\  ",
	"stick-right":
		"   _O_/<br>"+
		"  / |_ <br>"+
		"   / / ",
	"stick-left":
		"\\_O_   <br>"+
		" _| \\  <br>"+
		" \\ \\   ",
	"stick-dig-right":
		"__O    <br>"+
		"\\-|\\--><br>"+
		" / \\   ",
	"stick-dig-left":
		"    O__<br>"+
		"<--/|-/<br>"+
		"   / \\ ",
	"stick-dig-down":
		"   O/\\ <br>"+
		"  /\\_| <br>"+
		" /|  V ",
	"stick-dig-up":
		"   O A  <br>"+
		"  |\\=| <br>"+
		" / \\ | ",
	"chest":
		" _____ <br>"+
		"|==O==|<br>"+
		"|_____|",
	"chest-2":
		" _____ <br>"+
		"|=0=0=|<br>"+
		"|_____|",
	"worm-base":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-base-used":
		" _---_ <br>"+
		"(  0  )<br>"+
		" `---` ",
	"worm-head":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-head-used":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-body":
		" _---_ <br>"+
		"       <br>"+
		" `---` ",
	"worm-base-hard":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-base-used-hard":
		" _---_ <br>"+
		"(  0  )<br>"+
		" `---` ",
	"worm-head-hard":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-head-used-hard":
		" _---_ <br>"+
		"( ಠvಠ )<br>"+
		" `---` ",
	"worm-body-hard":
		" _---_ <br>"+
		"       <br>"+
		" `---` ",
	"worm-vertical-base":
		" _---_ <br>"+
		"( ʘ‿ʘ )<br>"+
		" `---` ",
	"worm-vertical-base-used":
		" _---_ <br>"+
		"(  0  )<br>"+
		" `---` ",
	"worm-vertical-head":
		" _---_ <br>"+
		"( ʘ‿ʘ )<br>"+
		" `---` ",
	"worm-vertical-head-used":
		" _---_ <br>"+
		"( ʘ‿ʘ )<br>"+
		" `---` ",
	"worm-vertical-body":
		"(     )<br>"+
		"(     )<br>"+
		"(     )",
	"bomb":
		"       <br>"+
		"   *   <br>"+
		"   O   ",
	"time-potion":
		"   m   <br>"+
		"  |*|  <br>"+
		"  |_|  ",
	"health-potion":
		"   m   <br>"+
		"  |♥|  <br>"+
		"  |_|  ",
};

var spriteMaps = {
	"stick-basic":
		"   a   ."+
		"  aaa  ."+
		"  b b  ",
	"stick-fall":
		" aaaaa ."+
		"   a   ."+
		"  b b  ",
	"stick-right":
		"   aaaa."+
		"  a aa ."+
		"   b b ",
	"stick-left":
		"aaaa   ."+
		" aa a  ."+
		" b b   ",
	"stick-dig-right":
		"aaa    ."+
		"asaasss."+
		" b b   ",
	"stick-dig-left":
		"    aaa."+
		"sssaasa."+
		"   b b ",
	"stick-dig-down":
		"   aaa ."+
		"  aaas ."+
		" bb  s ",
	"stick-dig-up":
		"   a s ."+
		"  aaas ."+
		" b b s ",
}
