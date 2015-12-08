/*\
title: $:/plugins/bj/plugins/mustache/mustachewidget.js
type: application/javascript
module-type: widget

Transclude widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MustacheWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
MustacheWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MustacheWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};
MustacheWidget.prototype.isJSTiddler = function(title) {
	var tiddler = $tw.wiki.getTiddler(title);
	if(tiddler) {		
		return !!tiddler.fields.type && tiddler.fields.type.indexOf("javascript") !== -1;
	} else {
		return null;
	}
};
MustacheWidget.prototype.isJSONTiddler = function(title) {
	var tiddler = $tw.wiki.getTiddler(title);
	if(tiddler) {		
		return !!tiddler.fields.type && tiddler.fields.type.indexOf("json") !== -1;
	} else {
		return null;
	}
};
/*
Compute the internal state of the widget
*/
MustacheWidget.prototype.execute = function() {
	// Get our parameters
	var self = this;
	this.parseType = this.getAttribute("$type","text/vnd.tiddlywiki");
	this.transcludeMode = this.getAttribute("mode");
	this.template = this.getAttribute("template");
	this.values = this.getAttribute("values");
	// Parse the text reference
	var parseAsInline = !this.parseTreeNode.isBlock;
	if(this.transcludeMode === "inline") {
		parseAsInline = true;
	} else if(this.transcludeMode === "block") {
		parseAsInline = false;
	}
	if($tw.browser) {
	var Mustache = require ("$:/plugins/bj/plugins/mustache/mustache.js");
	}
	var template = $tw.wiki.getTiddlerText(this.template);
	var values;
	if (this.isJSTiddler(this.values)) 
		try {
		values = require(this.values);
		}catch (e) {values ={};}
	else if (this.isJSONTiddler(this.values)) 
		try {
		values = $tw.wiki.getTiddlerData(this.values,{});
		}catch (e) {values ={};}
	else  {
		var tid = $tw.wiki.getTiddler(this.values);
		if (tid) values = tid.fields;
		else values = {};
	} 
	this.tpls = [this.template];//for refresh logic
	var f =  function(val) {//getter for partials 
		self.tpls.push(val);//save names of partials for refresh logic
		return $tw.wiki.getTiddlerText(val) ;
	}
	var text = Mustache.render(template,values,f);
	
	var parser = this.wiki.parseText(this.parseType,text,
						{parseAsInline: parseAsInline});
	var parseTreeNodes = parser ? parser.tree : [];

	// Construct the child widgets
	this.makeChildWidgets(parseTreeNodes);
};
MustacheWidget.prototype.templateswith = function(changedTiddlers) {
	var refresh;
	this.tpls.forEach(function(element, index, array) {
		if (!!changedTiddlers[element]) refresh = true;

	});
	return refresh;
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MustacheWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.values || changedTiddlers[this.values] || this.templateswith(changedTiddlers)) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

exports.mustache = MustacheWidget;

})();
