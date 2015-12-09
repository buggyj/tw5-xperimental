/*\
title: $:/bj/modules/widgets/mangletagsextra.js
type: application/javascript
module-type: widget

MangleTagsExtaWidget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MangleTagsExtraWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
MangleTagsExtraWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MangleTagsExtraWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();

};

/*
Compute the internal state of the widget
*/
MangleTagsExtraWidget.prototype.execute = function() {
	// Get our parameters
    if (this.getAttribute("removeAll")) this.removelist = this.wiki.filterTiddlers(this.getAttribute("removeAll"),this);
    if (this.getAttribute("addAll")) this.addlist = this.wiki.filterTiddlers(this.getAttribute("addAll"),this);
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MangleTagsExtraWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["removeAll"] || changedAttributes["addAll"]) {
		this.refreshSelf();
		return true;
	}
	else {
		return false;
	}
};

MangleTagsExtraWidget.prototype.invokeMsgAction = function(param) {
	// Set defaults
	var self = this;
	this.mangleTitle = this.getVariable("currentTiddler");
	if(param.event.param) {
		this.mangleTitle = param.event.param;
		this.sendParam = param.event.param;
	}
	if(this.catchTiddler) {
		this.mangleTitle = this.catchTiddler;
	}
	// Get the target tiddler
	var tiddler = this.wiki.getTiddler(this.mangleTitle);
	// If there is a find= attribute -- find the tag and remove it
	
	if(tiddler) {
		var modification;

		if (this.removelist) {
			if (!modification) {
				modification = this.wiki.getModificationFields();
				modification.tags = (tiddler.fields.tags || []).slice(0);
			}
			modification.tags = modification.tags.filter(function(i) {return self.removelist.indexOf(i) < 0;});
		}
 
		if(this.addlist) {
			if (!modification) {
				modification = this.wiki.getModificationFields();
				modification.tags = (tiddler.fields.tags || []).slice(0);
			}
			$tw.utils.pushTop(modification.tags,this.addlist);
		}

		// Save the modified tiddler
		if (modification) {
			this.wiki.addTiddler(new $tw.Tiddler(tiddler,modification));
		}
	}

	return param;

};

exports.mangletagsextra = MangleTagsExtraWidget;

})();
