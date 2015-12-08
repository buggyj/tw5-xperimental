/*\
title: $:/plugins/bj/plugins/mustache/mustachemacro.js
type: application/javascript
module-type: macro

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
* values could  be js, json, datatiddler, or other tiddler
* these need to be converted to compile js
* partials will be a function that uses gettiddlertext()

*/

exports.name = "mustache";

exports.params = [
	{ name: "template" },{ name: "values" }
];
/*
Run the macro
template is a js function, use require
*/
if($tw.browser) {
var Mustache = require ("$:/plugins/bj/plugins/mustache/mustache.js");
}
exports.run = function(template, values, partials) {
template = $tw.wiki.getTiddlerText(template);
values = $tw.wiki.getTiddlerData(values,{});
var tpls = [];
var f =  function(val) {
	tpls.push(val);
    return $tw.wiki.getTiddlerText(val) ;
}
var ret = Mustache.render(template,values,f);
alert(tpls.toString());
return ret;
}

})();
