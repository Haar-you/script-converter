var bhat_parser = function(){
    var map = {
	"a": unicode(0xe000),
	"t": unicode(0xe001),
	"k": unicode(0xe002),
	"x": unicode(0xe003),
	"s": unicode(0xe004),
	"n": unicode(0xe005),
	"m": unicode(0xe006),
	"d": unicode(0xe007),
	"g": unicode(0xe008),
	"p": unicode(0xe009),
	"b": unicode(0xe00a),
	"h": unicode(0xe00b),
	"c": unicode(0xe00c),
	"z": unicode(0xe00d),
	"l": unicode(0xe00e),
	"r": unicode(0xe00f),
	"j": unicode(0xe010),
	"y": unicode(0xe011),
	"w": unicode(0xe012),
	"dh": unicode(0xe013),
	"kh": unicode(0xe014),
	"gh": unicode(0xe015),
	"ph": unicode(0xe016),
	"bh": unicode(0xe017),
	"ṭ": unicode(0xe018),
	"ṭ": unicode(0xe018), //t + U+0323
	"ḍ": unicode(0xe019),
	"ḍ": unicode(0xe019), //d + U+0323
	"ṇ": unicode(0xe01a),
	"ṇ": unicode(0xe01a), //n + U+0323
	"ḷ": unicode(0xe01b),
	"ḷ": unicode(0xe01b), //l + U+0323
	"ṣ": unicode(0xe01d),
	"ṣ": unicode(0xe01d), //s + U+0323

	"i": unicode(0xe020),
	"u": unicode(0xe021),
	"á": unicode(0xe022),
	"á": unicode(0xe022), //a + U+0301
	"í": unicode(0xe023),
	"í": unicode(0xe023), //i + U+0301
	"ú": unicode(0xe024),
	"ú": unicode(0xe024), //u + U+0301
	"e": unicode(0xe025),
	"o": unicode(0xe026),
	"ai": unicode(0xe027),
	"au": unicode(0xe028),
	"noV": unicode(0xe029),
	"aq": unicode(0xe02f),

	".": unicode(0xe02a),
	",": unicode(0xe02b),
	"\"": unicode(0xe02c),
 	"?": unicode(0xe02d),
	"?\"": unicode(0xe02e),
	" ": " "
    };


    
    var isConsonant = Parser.matchStrIn(["dh","kh","gh","ph","bh","ṭ","ḍ","ṇ","ḷ","ṣ","t","k","x","s","n","m","d","g","p","b","h","c","z","l","r","j","y","w","ṭ","ḍ","ṇ","ḷ","ṣ"]);
    var isVowelExcludingA = Parser.matchStrIn(["ai", "au", "á", "í", "ú", "i", "u", "e", "o", "á", "í", "ú"]);
    var isPunctuation = Parser.matchStrIn(["?\"", " ", "\"", ",", ".", "?"]);


    var firstConsonant, secondConsonant;

    var isDoubleConsonants1 = Parser.option(
	Parser.and([
	    Parser.match(isConsonant, s => {firstConsonant = s; return null;}),
	    Parser.follow(isConsonant, s => {secondConsonant = s; return null;}),
	    Parser.generate((_ => {
		return function(text, pos){
		    if(firstConsonant == secondConsonant){
			return [pos, map["aq"]];
		    }else{
			return [null, null];
		    }
		};
	    }))
	])
    );

    var isDoubleConsonants2 = Parser.option(
	Parser.and([
	    Parser.match(isConsonant, s => {firstConsonant = s; return null;}),
	    Parser.follow(isConsonant, s => {secondConsonant = s; return null;}),
	    Parser.generate((_ => {
		return function(text, pos){
		    if(firstConsonant == secondConsonant){
			return [pos, map["noV"]];
		    }else{
			return [null, null];
		    }
		};
	    }))
	])
    );
    
    var parser =
	Parser.repeat(
	    Parser.or([
		Parser.lazy(_ => escaping),
		Parser.and([
		    Parser.follow(Parser.matchStr("["), _ => null),
		    Parser.lazy((_ => main_parser))
		]),
		Parser.and([
		    Parser.matchStr("a", _ => map["a"]),
		    isDoubleConsonants1
		]),
		Parser.and([
		    Parser.match(isVowelExcludingA, s => map["a"] + map[s]),
		    isDoubleConsonants2
		]),
		Parser.and([
		    Parser.match(isConsonant, s => map[s]),
		    Parser.or([
			Parser.and([
			    Parser.match(isVowelExcludingA, s => map[s]),
			    isDoubleConsonants2
			]),
			Parser.and([
			    Parser.matchStr("a", _ => null),
			    isDoubleConsonants1
			]),
			Parser.follow(Parser.option(Parser.any), s => map["noV"])
		    ])
		]),
		Parser.and([
		    Parser.matchStrIn([",", "."], s => map[s]),
		    Parser.and([
			Parser.matchStr(" "),
			Parser.or([
			    Parser.matchStrIn(["\"", "\"?"], s => map[" "] + map[s]),
			    Parser.follow(Parser.any(), _ => null)
			])
		    ])
		]),
		Parser.match(isPunctuation, s => map[s]),
		Parser.regexp("^[^\\[\\]]", s => s)
	    ]), null, null, s => `<span class="bhat">${s.join("")}</span>`);

    return parser;
}();
parser_map["bhat"] = bhat_parser;
