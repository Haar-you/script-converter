var paige_parser = function(){
    var initialCs = {
	"p": unicode(0xe056),
	"b": unicode(0xe057),
	"m": unicode(0xe058),
	"c": unicode(0xe059),
	"s": unicode(0xe05a),
	"x": unicode(0xe05b),
	"z": unicode(0xe05c),
	"t": unicode(0xe05d),
	"d": unicode(0xe05e),
	"n": unicode(0xe05f),
	"l": unicode(0xe060),
	"k": unicode(0xe061),
	"g": unicode(0xe062),
	"h": unicode(0xe063)
    };

    var finalCs = {
	"p": unicode(0xe064),
	"m": unicode(0xe065),
	"t": unicode(0xe066),
	"n": unicode(0xe067),
	"k": unicode(0xe068)
    };

    var tone = {
	"1": unicode(0xe069),
	"2": unicode(0xe06a)
    };

    var vowel = {
	"a": unicode(0xe040),
	"i": unicode(0xe041),
	"u": unicode(0xe042),
	"e": unicode(0xe043),
	"y": unicode(0xe044),
	"o": unicode(0xe045),
	"ia": unicode(0xe046),
	"ua": unicode(0xe047),
	"ie": unicode(0xe048),
	"ue": unicode(0xe049),
	"ai": unicode(0xe04a),
	"ui": unicode(0xe04b),
	"ei": unicode(0xe04c),
	"au": unicode(0xe04d),
	"io": unicode(0xe04e),
	"uo": unicode(0xe04f),
	"iai": unicode(0xe050),
	"uai": unicode(0xe051),
	"iei": unicode(0xe052),
	"uei": unicode(0xe053),
	"iau": unicode(0xe054),
	"uau": unicode(0xe055)
    };

    var punctuation = {
	"!": unicode(0xe06b),
	"?": unicode(0xe06c),
	".": unicode(0xe06d),
	",": unicode(0xe06e),
	"\"": unicode(0xe06f)
    };


    var isInitial = Parser.matchStrIn(["p", "b", "m", "c", "s", "x", "z", "t", "d", "n", "l", "k", "g", "h"]);
    var isVowel = Parser.matchStrIn(["a", "i", "u", "e", "o", "y", "ia", "ua", "ie", "ue", "ai", "ui", "ei", "au", "io", "uo", "iai", "uai", "iei", "uei", "iau", "uau"].reverse());
    var isFinal = Parser.matchStrIn(["p", "m", "t", "n", "k"]);
    var isTone = Parser.matchStrIn(["1", "2"]);
    var isPunctuation = Parser.matchStrIn(["!", "?", ".", ",", "\""]);
    

    var isSyllable = Parser.and([
	Parser.option(Parser.match(isInitial, s => initialCs[s])),
	Parser.match(isVowel, s => vowel[s]),
	Parser.option(Parser.match(isFinal, s => finalCs[s])),
	Parser.option(Parser.match(isTone, s => tone[s]))
    ]);


    var parser = Parser.repeat(
	Parser.or([
	    Parser.lazy(_ => escaping),
	    Parser.and([
		Parser.follow(Parser.matchStr("["), _ => null),
		Parser.lazy((_ => main_parser))
	    ]),
	    Parser.match(isSyllable),
	    Parser.match(isPunctuation, s => punctuation[s]),
	    Parser.matchStr(" ", _ => null),
	    Parser.regexp("^[^\\[\\]]", s => s)
	]), null, null, s => `<span class="paige">${s.join("")}</span>`);

    return parser;
}();
parser_map["paige"] = paige_parser;
