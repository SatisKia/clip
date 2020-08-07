function setWindowImg( imgId ){
	regGWorldDefCharInfoLarge( 0 );

	window.doCommandGWorld = function( width, height ){
		curClip().createCanvas( width, height );
	};

	var clip = new _EasyClip();
	clip.setPalette( COLOR_WIN );
	clip.procScript( [
		"@w = 22 * 17",
		"@h = 22 * 12",
		":gworld @w @h",
		":gfill 0 0 @w @h (gcolor \\xFFFFFF)",
		":window \\-5 \\-3 12 9",
		":wfill \\-3 \\-2 13 10 (gcolor \\xC0C0C0)",

		"@l = gx \\-3",
		"@b = gy \\-2",
		"@r = gx 10",
		"@t = gy 8",
		"@x = gx 0",
		"@y = gy 0",

		":gtext [\"(-3,-2)] (gx \\-5) (@b + 14) (gcolor \\x000000)",
		":gtextr [\"(10,8)] (gx 12) (@t - 2)",

		":wline 0 \\-2 0 8",
		":gline @x @t (@x - 4) (@t + 8)",
		":gline @x @t (@x + 4) (@t + 8)",
		":gtextr [\"y] (@x - 2) (@t + 22)",

		":wline \\-3 0 10 0",
		":gline @r @y (@r - 8) (@y - 4)",
		":gline @r @y (@r - 8) (@y + 4)",
		":gtextr [\"x] (@r - 10) (@y + 14)",

		":gtextr [\"-3] (@l - 2) (@y + 14)",
		":gtextr [\"0] (@x - 2) (@y + 14)",
		":gtext [\"10] (@r + 2) (@y + 14)",

		":gtextr [\"8] (@x - 2) (@t - 2)",
		":gtextr [\"-2] (@x - 2) (@b + 14)"
	] );
	clip.updateCanvas();

	var img = document.getElementById( imgId );
	img.src = clip.canvas().element().toDataURL( "image/png" );
}