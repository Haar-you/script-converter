function convert(){
    var textarea = document.getElementById("textarea");
    var display = document.getElementById("display");
    var lines = textarea.value.split(/\r\n|\r|\n/);
    var parser = main_parser;

    lang_code = new Stack(["any"]);

    display.innerHTML = "";
    lines.forEach(function(line){
//	var start = new Date();
	display.innerHTML += (parser(line)[1] || "" ) + "<BR>";
//	var end = new Date();
//	console.log(`${end - start} ms`);
    });
}

window.addEventListener("load", function(){
    var textarea = document.getElementById("textarea");

    textarea.addEventListener("keyup", function(evt){
	if(evt.which == 13 && evt.ctrlKey){ //enter + ctrl key
	    convert();
	}
    });
});
