/*\
title: $:/core/modules/widgets/msgexport.js
type: application/javascript
module-type: widget

create a json tiddler containing the msg table
* 
\*/
(function(){
//var count = 0;
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var SendMessageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
SendMessageWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SendMessageWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	var	fields = {
				title: this.tiddler,
				text: JSON.stringify(this.getTable(),null,$tw.config.preferences.jsonSpaces)
			
			};
	//create a json tiddler containing the msg table
	//count++;
	this.wiki.addTiddler(new $tw.Tiddler(fields));
};

/*
Compute the internal state of the widget
*/
SendMessageWidget.prototype.execute = function() {
	this.tiddler = this.getAttribute("tiddler");

};

/*
Refresh the widget by ensuring our attributes are up to date
*/
SendMessageWidget.prototype.refresh = function(changedTiddlers) {

	return this.refreshChildren(changedTiddlers);
};



exports["msgexport"] = SendMessageWidget;

})();
