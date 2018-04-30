var lineparine_parser = function(){
    var map = {
	"vh": "V",
	"fh": "F",
	"dz": "X"
    };
    
    var parser =
	Parser.repeat(
	    Parser.or([
		Parser.lazy(_ => escaping),
		Parser.and([
		    Parser.follow(Parser.matchStr("["), _ => null),
		    Parser.lazy((_ => main_parser))
		]),
		Parser.and([
		    Parser.matchCharIn("aiueoy", s => s),
		    Parser.matchStr("r", _ => "R")
		]),
		Parser.matchStr("r", _ => "r"),
		Parser.matchStrIn(["vh", "fh", "dz"], s => map[s]),
		Parser.regexp("^[^\\[\\]]", s => s)
	    ]), null, null, s => `<span class="lineparine">${s.join("")}</span>`);
    return parser;
}();
parser_map["lpa"] = lineparine_parser;
