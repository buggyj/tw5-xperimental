/*\
title: $:/mcore/modules/widgets/play.js
type: application/javascript
module-type: widget

Reveal widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
//alert = function () {};
var count = 0;
var intra = "play";
var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var RevealWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
RevealWidget.prototype = new Widget();


RevealWidget.prototype.handler = "py";

RevealWidget.prototype.wtype = intra;

/*
Render this widget into the DOM
*/
RevealWidget.prototype.render = function(parent,nextSibling) {
	this.here = {};
	this.here.domNode = null;
	this.here.isOpen = false;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	var tag = this.parseTreeNode.isBlock ? "div" : "span";
	if(this.revealTag && $tw.config.htmlUnsafeElements.indexOf(this.revealTag) === -1) {
		tag = this.revealTag;
	}
	var domNode = this.document.createElement(tag);
	var classes = this["class"].split(" ") || [];
	domNode.className = classes.join(" ");
	if(this.style) {
		domNode.setAttribute("style",this.style);
	}
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);//if there is not a matching default then there will not be children - see execute.

	domNode.setAttribute("hidden","true");

	this.domNodes.push(domNode);//alert("ren"+this.domNodes.length)
	/////////////	
	//bj meditation: hid this name mangling with a method in base class
	count++;
	this[this.wtype+count] = this.handlesetvalEvent;
	this.handlename = this.wtype+count;
	///////////
	domNode.setAttribute("id",this.handlename);//link the dom with the callback
	domNode.setAttribute("data-event",this.Id+"/mtm-play");
	//the value fof domNode below is added by the reduce runtime to the table enties, when it add the replacement for handlesetvalEvent
	
	if (this.handler) this[this.handler] = $tw.modules.applyMethods("dom_method")[this.handler];
	//bj addIdEventListeners adds callback function handleNavigateEvent to this widget instance with key = id/type
	// there will be a removeIdEventListeners ([{type: "tm-navigate", id:this.id}]) which widget calls on closing down
	if (this.Id) {	//alert("set "+this.Id+"/mtm-popup")		
		this.addIdEventListeners([
			{handler: this.handlename, id:this.Id+"/mtm-play", aux:this.here, dom_method:this.handler}
		]);
	}
};

/*
Compute the internal state of the widget
*/
RevealWidget.prototype.execute = function() {
	// Get our parameters

	this.Id = this.getAttribute("recvOn");
	
	this.here.type = this.getAttribute("type");
	this.here.text = this.getAttribute("text");
	this.revealTag = this.getAttribute("tag");

	
	this["class"] = this.getAttribute("class","");
	this.style = this.getAttribute("style","");
	this["default"] = this.getAttribute("default","");
	


	// Construct the child widgets
	var childNodes = this.parseTreeNode.children;//Note that when rending there can be no children
	this.hasChildNodes = true;
	this.makeChildWidgets(childNodes);
};


/*Remove any DOM nodes created by this widget or its children
*/
RevealWidget.prototype.removeChildDomNodes = function() {
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
	this.delIdEventListeners([
		{ handler: this.handlename, id:this.Id+"/mtm-play"}
	]);
};


RevealWidget.prototype.handlesetvalEvent = function(event,aux) {
	//bj meditation: in the reduced case, the domnode with be passed here? or will be place in table?
	//the runtime will have to connect this up to the table up - better use table
	var domNode = aux.domNode?aux.domNode:this.domNodes[0];
	this[this.handler](event,aux, domNode);
}

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
RevealWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};


exports[intra] = RevealWidget;//play

})();
