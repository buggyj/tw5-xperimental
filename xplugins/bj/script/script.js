/*\
title: $:/plugins/bj/plugins/script/script.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ScriptWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ScriptWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ScriptWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
		// Create our element
	var domNode = this.document.createElement("script");
	if (this.id) domNode.setAttribute("id",this.id);
	if (this.type) domNode.setAttribute("type",this.type);
	var textNode = this.document.createTextNode(this.text);
	domNode.insertBefore(textNode,nextSibling);
	this.domNodes.push(textNode);
	parent.insertBefore(domNode,null);
	this.domNodes.push(domNode);
};

/*
Compute the internal state of the widget
*/
ScriptWidget.prototype.execute = function() {
	// Get our parameters
	var self = this;
	this.source = this.getAttribute("source");
	var tiddler = $tw.wiki.getTiddler(this.source);
	if(tiddler) {	
		this.text = tiddler.fields.text;
		this.id = tiddler.fields.id;
		this.transcludeMode = tiddler.fields.transcludeMode;
		this.type = tiddler.fields.type;
	}
	this.id = this.getAttribute("id")||this.id ;
	this.transcludeMode = this.getAttribute("mode")||this.transcludeMode;
	this.type = this.getAttribute("type")||this.type;
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ScriptWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if((Object.keys(changedAttributes).length) || changedTiddlers[this.source]) {
		this.refreshSelf();
		return true;
	} else {
		return false;		
	}
};

exports.script = ScriptWidget;

})();
