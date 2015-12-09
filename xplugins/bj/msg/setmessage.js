/*\
title: $:/mcore/modules/widgets/sentmessage.js
type: application/javascript
module-type: widget

Action widget to send a message

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

/*
Inherit from the base widget class
*/
SendMessageWidget.prototype = new Widget();

SendMessageWidget.prototype.etype = "click"

SendMessageWidget.prototype.wtype = "action-sm"

SendMessageWidget.prototype.handler = "as";
/*
Compute the internal state of the widget
*/
SendMessageWidget.prototype.execute = function() {
	var self = this;

	this.here = Object.create(null);//hold the values for the dowmsteam dynamic
	this.here.sendId = this.getAttribute("$sendOn");
	this.here.sendType = this.getAttribute("$action");

	// Assemble the attributes as a hashmap
	this.here.paramObject = Object.create(null);
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) !== "$") {
			self.here.paramObject[name] = attribute;
		}
	});

	this.here.tiddlerTitle = this.getVariable("currentTiddler");
	this.here.storyTiddler = this.getVariable("storyTiddler");
};

exports["sentmessage"] = SendMessageWidget;

})();
