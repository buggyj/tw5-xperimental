/*\
title: $:/plugins/bj/plugins/script/scriptmacro.js
type: application/javascript
module-type: macro
*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "script";

exports.params = [
	{name: "source"}
];

/*
Run the macro
*/
exports.run = function(filter) {
	var text,id,transcludeMode,type,returns="<script ";
	var tiddler = $tw.wiki.getTiddler(source);
	if(tiddler) {	
		text = tiddler.fields.text;
		id = tiddler.fields.id;
		type = tiddler.fields.type;
	}
	returns += id ? 'id="'+id+'" ':'';
	returns += type ? 'type="'+type+'" ' : "";
	returns += '>';
	returns += text ? text : "";
	returns += '</script>';
	return returns;
};

})();

