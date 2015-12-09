/*\
title: $:/bj/modules/widgets/local.js
type: application/javascript
module-type: widget

MangleTagsExtaWidget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MangleTagsWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
        {type: "tm-navigate", handler: "handleMangleTagsEvent"}
   	]);
};

/*
Inherit from the base widget class
*/
MangleTagsWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MangleTagsWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
MangleTagsWidget.prototype.execute = function() {
	// Get our parameters
    this.msg = this.getAttribute("msg");
 this.tid = this.getAttribute("tid");
    //if (this.getAttribute("addAll")) this.addlist = this.wiki.filterTiddlers(this.getAttribute("addAll"),this);
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MangleTagsWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(false) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};

MangleTagsWidget.prototype.handleMangleTagsEvent = function(event) {
	// Set defaults
	var self = this;
	var ref = {};
	ref[this.tid] = {"modified":true};
	this.refreshChildren(ref);
};

exports.local = MangleTagsWidget;

})();
