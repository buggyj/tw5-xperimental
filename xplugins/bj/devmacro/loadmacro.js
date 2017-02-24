/*\
title: $:/core/modules/macros/loadmacro.js
type: application/javascript
module-type: macro

Macro to return a formatted version of the current time

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
compile dev marcos - allows hot reload of macro
*/

exports.name = "loadmacro";

exports.params = [
	{name: "macro"}
];

/*
Run the macro
*/

exports.run = function(macro) {
var tiddler = $tw.wiki.getTiddler(macro);

var olderr = $tw.utils.error;
$tw.utils.error = function (errorMsg) {
    alert('Error: ' + errorMsg );
}

$tw.modules.define(tiddler.fields.title,"macro",tiddler.fields.text);
$tw.macros = $tw.modules.getModulesByTypeAsHashmap("macro");

$tw.utils.error = olderr;
};

})();
