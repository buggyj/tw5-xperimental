/*\
title: $:/core/modules/widgets/app-submit.js
type: application/javascript
module-type: widget
\*/
(function(){
//alert = function () {};
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var count = 0;

var Widget = require("$:/mcore/modules/widgets/event.js").event;

var SendMessageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.count = count++;
};

SendMessageWidget.prototype = new Widget();

SendMessageWidget.prototype.etype = "submit"

SendMessageWidget.prototype.wtype = "app-submit"

SendMessageWidget.prototype.handler =  "do-submit";

SendMessageWidget.prototype.execute = function() {
	var self = this;	
	this.here = Object.create(null);//hold the values for the dowmsteam dynamic

	this.here.tiddler = this.getAttribute("tiddler");
	this.here["class"] = this.getAttribute("class","");

	this.here.tiddlerTitle = this.getVariable("currentTiddler");
	this.here.storyTiddler = this.getVariable("storyTiddler");
};

exports["app-submit"] = SendMessageWidget;

})();
