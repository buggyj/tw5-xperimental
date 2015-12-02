/*\
title: $:/plugins/bj/mdplus/parsers/markapdaper.js
type: application/javascript
module-type: parser

enables marked output to be exposed as a string
\*/

(function(){



/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var rawMd = function(type,text,options) {
	var marked = require("$:/plugins/bj/plugins/marked/markdown.js");
	var opts;
	if (!!options) {opts = options.parserrules;}
	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: marked(text,opts)
		}]
	}];
};

exports["text/x-rawmarked"] = rawMd;

})();

