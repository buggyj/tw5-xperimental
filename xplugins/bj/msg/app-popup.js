/*\
title: $:/core/modules/widgets/app-popup.js
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

SendMessageWidget.prototype = new Widget();

SendMessageWidget.prototype.etype = "click"

SendMessageWidget.prototype.wtype = "app-popup";

SendMessageWidget.prototype.handler = "do-popup";

exports["app-popup"] = SendMessageWidget;

})();
