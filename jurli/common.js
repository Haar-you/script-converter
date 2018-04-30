var Stack = function(arr=[]){
    this.array = arr;
}
Stack.prototype.push = function(val){
    this.array.push(val);
}
Stack.prototype.pop = function(){
    return this.array.pop();
}
Stack.prototype.top = function(){
    var val = this.array.pop();
    this.array.push(val);
    return val;
}

var unicode = function(code){
    return String.fromCharCode(code);
};

var parser_map = {};
var lang_code = new Stack(["any"]);

var main_parser = function(){
    var parser = Parser.repeat(
	Parser.or([
	    Parser.and([
		Parser.matchStr("[", _ => null),
		Parser.regexp("^[a-zA-Z0-9\-_]+", s => {lang_code.push(s); return null;}),
		Parser.matchStr(":", _ => null),
		Parser.generate(_ => parser_map[lang_code.top()]),
		Parser.option(
		    Parser.matchStr("]", _ => {lang_code.pop(); return null;})
		)
	    ]),
	    Parser.and([
		Parser.matchStr("]", _ => {lang_code.pop(); return null;})
	    ]),
	    Parser.and([
		Parser.isFirst(),
		Parser.and([
		    Parser.isNotLast(),
		    Parser.generate(_ => parser_map[lang_code.top()]),
		])
	    ]),
	]), 1, null, s => {return s.join("")});
    
    return parser;
}();

var escaping =
    Parser.and([
	Parser.matchStr("\\", _ => null),
	Parser.or([
	    Parser.matchCharIn("\\[]"),
	    Parser.matchStr("n", _ => "<br>")
	])
    ]);



parser_map["any"] = Parser.repeat(
    Parser.or([
	escaping,
	Parser.and([
	    Parser.follow(Parser.matchCharIn("["), _ => null),
	    Parser.lazy((_ => main_parser)),
	]),
	Parser.regexp("^[^\\[\\]]", s => s),
    ]), null, null, s => `<span class="any">${s.join("")}</span>`);

