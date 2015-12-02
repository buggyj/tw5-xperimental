/*\
title: $:/plugins/bj/mdplus/parsers/PostMd.js
type: application/javascript
module-type: parser

to support inclusions
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PostMd = function(type,text,options) {
	if (!!options.parserrules) {
			var reg =  new RegExp($tw.utils.escapeRegExp(options.parserrules.leftOfMacro)+"([\\S\\s]*?)"+
									$tw.utils.escapeRegExp(options.parserrules.rightOfMacro),"mg");
	}
	text = 	text.replace(reg,function(m,key,offset,str){ 
		return "<<"+ $tw.utils.htmlDecode(key)+">>";
	});
	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: text
		}]
	}];
};

exports["text/x-PostMd"] = PostMd;

})();

