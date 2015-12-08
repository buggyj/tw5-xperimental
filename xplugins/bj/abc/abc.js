/*\
title: $:/bj/modules/widgets/abc.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ABCWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ABCWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ABCWidget.prototype.render = function(parent,nextSibling) {
	var self  = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.pNode = this.document.createElement("div");
	parent.insertBefore(this.pNode,nextSibling);
	if (this.source) {
		this.tid  = $tw.wiki.getTiddlerText(this.source)
		ABCJS.renderAbc(this.pNode, this.tid);
		var width = parent.clientWidth*2/3;
		this.parentwidth = parent.clientWidth;
		ABCJS.renderAbc(this.pNode, "%%staffwidth "+width+"\n"+this.tid);
	}
	this.domNodes.push(this.pNode);
	self.parentDomNode.onresize = function (event) {
		if (self.parentwidth != self.parentDomNode.clientWidth) {
			var width = parent.clientWidth*2/3;
			self.parentwidth = parent.clientWidth;
			ABCJS.renderAbc(self.pNode, "%%staffwidth "+width+"\n"+self.tid);
		}
		return true;
	}
};
//to make it reactive to the resize there's this event:
//object.addEventListener("resize", myScript);

/*
Compute the internal state of the widget
*/
ABCWidget.prototype.execute = function() {
	this.source = this.getAttribute("source");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
ABCWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["source"]||changedTiddlers[this.source]) {
		this.refreshSelf();
		return true;
	}
	return false;
};

exports["abc"] = ABCWidget;


})();



