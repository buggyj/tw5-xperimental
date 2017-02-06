/*\
title: $:/plugins/bj/WidgetTreeViewer/tree.js
type: application/javascript
module-type: widget


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var MIN_TEXT_AREA_HEIGHT = 100; // Minimum height of textareas in pixels


var Vars = require("$:/core/modules/widgets/vars.js").vars;

var Treerootwidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

Treerootwidget.prototype = new Vars();

exports["widget-tree-root"] = Treerootwidget;

var Widget = require("$:/core/modules/widgets/widget.js").widget;
 
var EditJsonWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};


EditJsonWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
EditJsonWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create our element
    this.gettidtree();
	this.renderChildren(parent,nextSibling);
};


/*
Compute the internal state of the widget
*/
EditJsonWidget.prototype.execute = function() {
	// Get our parameters
	var n=0, name = this.getAttribute("name");
	this.widget=null;
	var self = this;
	if (name) {
		this.root = $tw.rootWidget;
		var find = function (children) {
			$tw.utils.each(children,function(childWidget) {
				if (!childWidget) return;
				if (childWidget.parseTreeNode && childWidget.parseTreeNode.type == "set" ) {
					if (childWidget.parseTreeNode.attributes.name.value == name
						&& childWidget.parseTreeNode.attributes.value.value == name
						) {self.widget = childWidget;return}
				}
				find (childWidget.children);	
			});
		}
		find(this.root.children);	
	}
	this.root = self.widget||$tw.rootWidget;
		// Construct the child widgets
	this.makeChildWidgets();

};


EditJsonWidget.prototype.gettidtree = function() {
	// Get our parameters
	var find = function (children) {
		var contains =[];
		$tw.utils.each(children,function(childWidget) {
			if (!childWidget) return;//alert("ch "+JSON.stringify(childWidget.parseTreeNode.type));
			if (childWidget.parseTreeNode && childWidget.parseTreeNode.type == "transclude" ) {
				
				
				var resolve = function(attribute,childWidget) {
					var value;
					if (!attribute) return childWidget.getVariable("currentTiddler");//BJ why is this?
					if(attribute.type === "indirect") {
						value = childWidget.wiki.getTextReference(attribute.textReference,"",childWidget.getVariable("currentTiddler"));
					} else if(attribute.type === "macro") {
						value = childWidget.getVariable(attribute.value.name,{params: attribute.value.params});
					} else { // String attribute
						value = attribute.value;
					}
					if (value =="") value = childWidget.getVariable("currentTiddler");
					return value;
				}
				var tid = {name:resolve(childWidget.parseTreeNode.attributes.tiddler,childWidget)};
				var content = find(childWidget.children);
				if (content.length != 0) tid.contains = content;
				contains.push (tid);
				return;
			} 
			contains = contains.concat(find(childWidget.children));
			
			//find (childWidget.children);	
			
		});//alert("js "+JSON.stringify(contains));
		return contains;
	}
	this.tree = find(this.root.children)||"[good:'day']";	
	this.setVariable("thetree",JSON.stringify(this.tree,null,"    "));
};



/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
EditJsonWidget.prototype.refresh = function(changedTiddlers) {
	return false;
};


exports["tiddler-tree-viewer"] = EditJsonWidget;

})();
