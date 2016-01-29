/*\
title: $:/plugins/bj/plugins/assorted/react.js
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
	//this.domNodes.push(textNode);


	var domdomNode = this.document.createElement("div");
	domdomNode.setAttribute("id",this.domid);
	parent.insertBefore(domdomNode,null);
	
	var domNode = this.document.createElement("script");
	if (this.id) domNode.setAttribute("id",this.id);
	if (this.type) domNode.setAttribute("type",this.type);
	if(this.tiddler) {	
		var bb =babel.transform(this.tiddler.fields.text, {});
		this.text = bb.code;
	}
	eval(this.text)
	//var textNode = this.document.createTextNode(this.text);
	//parent.insertBefore(domNode,null);
	//domNode.insertBefore(textNode,nextSibling);

this.domdomNode = domdomNode;
//alert(this.text )
	//this.domNodes.push(domNode);
	this.domNodes.push(domdomNode);
};

/*
Compute the internal state of the widget
*/
ScriptWidget.prototype.execute = function() {
	// Get our parameters
	var self = this;
	this.id = this.getAttribute("id");
	this.domid =  this.getAttribute("domid");
	this.transcludeMode = this.getAttribute("mode");
	this.source = this.getAttribute("source");
	this.type = this.getAttribute("type");
	this.tiddler = $tw.wiki.getTiddler(this.source);
        

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
ScriptWidget.prototype.removeChildDomNodes = function() {
//alert(this.text+ "dom remove")
	// If this widget has directly created DOM nodes, delete them and exit. This assumes that any child widgets are contained within the created DOM nodes, which would normally be the case
	$tw.utils.each(this.children,function(childWidget) {
			childWidget.removeChildDomNodes();
		});

	if(this.domNodes.length > 0) {
		$tw.utils.each(this.domNodes,function(domNode) {
			domNode.parentNode.removeChild(domNode);
		});
		this.domNodes = [];
	}
	 React.unmountComponentAtNode(this.domdomNode);
};
exports.react = ScriptWidget;

})();
