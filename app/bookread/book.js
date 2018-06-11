var EPub = require("epub");
var epub = new EPub('/Users/dai/Desktop/tibet/app/public/novels/wljs.epub');

epub.on("end", function(){
	// epub is now usable
	console.log(epub.metadata);

	epub.getChapter("chapter_id", function(err, text){});
});
epub.parse();