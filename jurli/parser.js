var Parser = function(){};

Parser.matchStr = function(str, func=null){
    return function(input, position=0){
	if(input.startsWith(str, position)){
	    return [position + str.length, func ? func(str) : str];
	}else{
	    return [null, null];
	}
    };
};

Parser.matchStrIn = function(strs, func=null){
    return function(input, position=0){
	for(var i=0; i<strs.length; ++i){
	    if(input.startsWith(strs[i], position)){
		return [position + strs[i].length, func ? func(strs[i]) : strs[i]];
	    }
	}
	return [null, null];
    };
}

Parser.or = function(parsers, func=null){
    return function(input, position=0){	
	var result;
	for(var i=0; i<parsers.length; ++i){
	    if(parsers[i] == null) continue;
	    result = parsers[i](input, position);
	    if(result[0] != null){
		return [result[0], func ? func([result[1]]) : result[1]];
	    }
	}
	return [null, null];
    };
};

Parser.and = function(parsers, func=null){
    return function(input, position=0){
	var new_position = position;
	var result;
	var replacings = [];

	for(var i=0; i<parsers.length; ++i){
	    if(parsers[i] == null) continue;
	    result = parsers[i](input, new_position);
	    if(result[0] == null){
		return [null, null];
	    }
	    new_position = result[0];
	    replacings.push(result[1]);
	}
	return [new_position, func ? func(replacings) : replacings.join("")];
    };
};

Parser.repeat = function(parser, min=null, max=null, func=null){
    return function(input, position=0){

	var result = [null, null];
	var new_position = position;
	var count = 0;
	var replacings = [];

	do{
	    if(max != null && count >= max){
		return [new_position, func ? func(replacings) : replacings.join("")];
	    }
	    
	    result = parser(input, new_position);

	    if(result[0] == null){
		if(min != null && count < min){
		    return [null, null];
		}else{
		    return [new_position, func ? func(replacings) : replacings.join("")];
		}
	    }

	    new_position = result[0];
	    replacings.push(result[1]);

	    count++;

	}while(true);
    };
};

Parser.match = function(parser, func=null){
    return function(input, position=0){
	var result = parser(input, position);

	if(result[0] != null){
	    return [result[0], func ? func([result[1]]) : result[1]];
	}else{
	    return [null, null];
	}
    };
};


Parser.any = function(func=null){
    return function(input, position=0){
	if(position < input.length){
	    return [position+1, func ? func([input[position]]) : input[position]];
	}else{
	    return [null, null];
	}
    };
};

Parser.follow = function(parser, func=null){
    return function(input, position=0){
	var result = parser(input, position);

	if(result[0] != null){
	    return [position, func ? func([result[1]]) : result[1]];
	}else{
	    return [null, null];
	}
    };
};

Parser.notFollow = function(parser, func=null){
    return function(input, position=0){
	var result = parser(input, position);

	if(result[0] == null){
	    return [position, func ? func([result[1]]) : result[1]];
	}else{
	    return [null, null];
	}
    };
};

Parser.option = function(parser, func=null){
    return function(input, position=0){
	var result = parser(input, position);

	if(result[0] != null){
	    return [result[0], func ? func([result[1]]) : result[1]];
	}else{
	    return [position, func ? func("") : ""];
	}
    };
};

Parser.regexp = function(pattern, func=null){
    var reg = new RegExp(pattern);
    return function(input, position=0){
	var m = input.substr(position).match(reg);
	if(m){
	    return [position + m[0].length, func ? func(m[0]) : m[0]];
	}else{
	    return [null, null];
	}
    };
};


Parser.lazy = function(generator){
    var parser = null;
    return function(input, position=0){
	if(parser == null) parser = generator();
	return parser(input, position);
    };
};

Parser.generate = function(generator){
    return function(input, position=0){
	return generator()(input, position);
    };
};

Parser.apply = function(parser, func){
    return function(input, position=0){
	var result = parser(input, position);
	if(result[0] != null){
	    return [result[0], func([result[1]])];
	}else{
	    return result;
	}
    };
};

Parser.matchCharIn = function(str, func=null){
    var seq = str.split("");
    return function(input, position=0){
	for(var i=0; i<seq.length; ++i){
	    if(input[position] == seq[i]){
		return [position+1, func ? func(input[position]) : input[position]];
	    }
	}
	return [null, null];
    };
};

Parser.isFirst = function(){
    return function(input, position=0){
	if(position==0){
	    return [position, null];
	}else{
	    return [null, null];
	}
    }
}

Parser.isNotFirst = function(){
    return function(input, position=0){
	if(position>0){
	    return [position, null];
	}else{
	    return [null, null];
	}
    }
}

Parser.isLast = function(){
    return function(input, position=0){
	if(position==input.length-1){
	    return [position, null];
	}else{
	    return [null, null];
	}
    }
}

Parser.isNotLast = function(){
    return function(input, position=0){
	if(position<input.length-1){
	    return [position, null];
	}else{
	    return [null, null];
	}
    }
}

