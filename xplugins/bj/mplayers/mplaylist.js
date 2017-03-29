/*\
title: $:/bj/modules/widgets/msequence.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MPlayListWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
		this.addEventListeners([
	{type: "tm-mply-restart", handler: "handleReStart"},
	{type: "tm-mply-stick", handler: "handleStick"},
	{type: "tm-mply-unstick", handler: "handleUnStick"},
	{type: "tm-mply-forcenext", handler: "handleForceNext"},
	{type: "tm-mply-next", handler: "handleNextEvent"},
	{type: "tm-mply-move", handler: "handleMoveEvent"},
	{type: "tm-mply-caught", handler: "handleCaughtEvent"},
	{type: "tm-mply-prev", handler: "handlePrevEvent"}]);
};
/*
Inherit from the base widget class
*/
MPlayListWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MPlayListWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
	if (this.autoStart === "yes")this.doStart();
};

/*
Compute the internal state of the widget
*/
MPlayListWidget.prototype.execute = function() {
	// Compose the list elements
	this.list = this.getTiddlerList();
	this.sticky = false;
	this.n =-1;
	this.autoStart = this.getAttribute("autoStart")
	this.onEnd = this.getAttribute("onEnd");
	this.onEndParam = this.getAttribute("onEndParam");
    this.syntid = this.getAttribute("syntid");
    this.mode = this.getAttribute("mode");
		// Construct the child widgets
	this.makeChildWidgets();
};

MPlayListWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[tag["+this.getAttribute("targetTag")+"]]";
	return this.wiki.filterTiddlers(this.getAttribute("filter",defaultFilter),this);
};
/*
Refresh the widget by ensuring our attributes are up to date
*/
MPlayListWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	//alert(this.attributes.filter);
	if(changedAttributes.targetTag || changedAttributes["$tiddler"]) {
		this.list = this.getTiddlerList();
		this.n =-1;
		if (this.autoStart === "yes")this.doStart();
		//this.updatelist();
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/

MPlayListWidget.prototype.updatelist = function() {
	var list,n,i,curr = this.list[this.n];
	list = this.getTiddlerList();
	for ( i = 0; i < list.length; i++) {
		if (list[i] === curr) break;
	}
	if (i === list.length) i = 0;
	this.n = i;
	this.list = list;
}
	
MPlayListWidget.prototype.doMove = function(loc) {
	if (this.mode == "dynamic") this.updatelist();
	if(this.list.length === 0) {
		//do nothing
	} else {
		var tid,i;
		for (i = 0; i < this.list.length; i++) {
			if ((loc == this.list[i]) && (tid = this.wiki.getTiddler(this.list[i]))) {
				this.invokeActions(this,{type:"preStart",tiddler: this.list[i]});
				this.caught = null;
				this.invokeActions(this,{type:"start",tiddler: this.list[i]});
				if (this.caught) {
					this.wiki.setTextReference(this.syntid,this.list[i],this.getVariable("currentTiddler"));
					
					if (this.syntid.substring(0,17) === "$:/temp/__priv__/") {
						this.dispatchEvent({
							type: "tm-bj-playerRfresh",
							paramObject : {title: this.syntid}
						});
					}
					break;
				}
			}
		}
		this.n = (i == this.list.length ? this.list.length - 1 : i);
	}
}
MPlayListWidget.prototype.doStart = function() {
	if (this.mode == "dynamic") this.updatelist();
	this.n = -1;
	if(this.list.length === 0) {
		//do nothing
	} else {
		var tid,i;
		if (this.n == this.list.length -1) { alert (this.list.length);
			//self.invokeActions(event);//BJ fix!
			return;
		};
		for (i = this.n + 1; i < this.list.length; i++) {
			if ((tid = this.wiki.getTiddler(this.list[i]))) {
				this.invokeActions(this,{type:"preStart",tiddler: this.list[i]});
				this.caught = null;
				this.invokeActions(this,{type:"start",tiddler: this.list[i]});
				if (this.caught) {
					this.wiki.setTextReference(this.syntid,this.list[i],this.getVariable("currentTiddler"));
					
					if (this.syntid.substring(0,17) === "$:/temp/__priv__/") {
						this.dispatchEvent({
							type: "tm-bj-playerRfresh",
							paramObject : {title: this.syntid}
						});
					}
					break;
				}
			}
		}
		this.n = (i == this.list.length ? this.list.length - 1 : i);
		if ((this.onEnd) && (this.n == this.list.length -1)){
			if (this.onEndParam) {
				this.dispatchEvent({
				type: this.onEnd,
				param: this.onEndParam
				});
			} else {
				this.dispatchEvent({
				type: this.onEnd
				});
			}	
			return;
		}
	}
}

MPlayListWidget.prototype.doNext = function() {
	if (this.mode == "dynamic") this.updatelist();
	if(this.list.length === 0) {
		//do nothing
	} else {
		var tid,i;

		for (i = this.n + 1; i < this.list.length; i++) {
			if ((tid = this.wiki.getTiddler(this.list[i]))) {
				this.invokeActions(this,{type:"preStart",tiddler: this.list[i]});
				this.caught = null;
				this.invokeActions(this,{type:"start",tiddler: this.list[i]});
				if (this.caught) {
					this.wiki.setTextReference(this.syntid,this.list[i],this.getVariable("currentTiddler"));
					
					if (this.syntid.substring(0,17) === "$:/temp/__priv__/") {
						this.dispatchEvent({
							type: "tm-bj-playerRfresh",
							paramObject : {title: this.syntid}
						});
					}
					break;
				}
			}
		}
		
		this.n = (i == this.list.length ? this.list.length - 1 : i);
				
		if ((this.onEnd) && (this.n == this.list.length -1)){
			if (this.onEndParam) {
				this.dispatchEvent({
				type: this.onEnd,
				param: this.onEndParam
				});
			} else {
				this.dispatchEvent({
				type: this.onEnd
				});
			}	
			return;
		}
	}
}
MPlayListWidget.prototype.doPrev = function() {
	if (this.mode == "dynamic") this.updatelist();
	if(this.list.length === 0) {
		//do nothing
	} else {
		var tid,i;
		
		for (i = this.n - 1 ; i >=0; i--) {
			if ((tid = this.wiki.getTiddler(this.list[i]))) {
				this.invokeActions(this,{type:"preStart",tiddler: this.list[i]});
				this.caught = null;
				this.invokeActions(this,{type:"start",tiddler: this.list[i]});
				if (this.caught) {
					this.wiki.setTextReference(this.syntid,this.list[i],this.getVariable("currentTiddler"));
					
					if (this.syntid.substring(0,17) === "$:/temp/__priv__/") {
						this.dispatchEvent({
							type: "tm-bj-playerRfresh",
							paramObject : {title: this.syntid}
						});
					}
					break;
				}
			}
		}
		this.n = (i == -1? 0 : i);
	}
}

MPlayListWidget.prototype.doAgain = function() {
	if (this.mode == "dynamic") this.updatelist();
	if(this.list.length === 0) {
		//do nothing
	} else {
		var tid,i;
		
		for (i = this.n; i >=0; i--) {
			if ((tid = this.wiki.getTiddler(this.list[i]))) {
				this.invokeActions(this,{type:"preStart",tiddler: this.list[i]});
				this.caught = null;
				this.invokeActions(this,{type:"start",tiddler: this.list[i]});
				if (this.caught) {
					this.wiki.setTextReference(this.syntid,this.list[i],this.getVariable("currentTiddler"));
					
					if (this.syntid.substring(0,17) === "$:/temp/__priv__/") {
						this.dispatchEvent({
							type: "tm-bj-playerRfresh",
							paramObject : {title: this.syntid}
						});
					}
					break;
				}
			}
		}
		this.n = (i == -1? 0 : i);
	}
}
MPlayListWidget.prototype.handleCaughtEvent = function(event) {
		// Check for an empty list
	this.caught = true;
	return false; // dont propegate
}
MPlayListWidget.prototype.handleReStart = function(event) {
		// Check for an empty list
	this.doStart();
	return false; // dont propegate
}
MPlayListWidget.prototype.handleNextEvent = function(event) {
		// Check for an empty list
	if (this.sticky) this.doAgain();
	else this.doNext();
	return false; // dont propegate
}
MPlayListWidget.prototype.handleForceNext = function(event) {
		// Check for an empty list
	this.doNext();
	return false; // dont propegate
}
MPlayListWidget.prototype.handleStick = function(event) {
		// Check for an empty list
	this.sticky=true;
	return false; // dont propegate
}
MPlayListWidget.prototype.handleUnStick = function(event) {
		// Check for an empty list
	this.sticky=false;
	return false; // dont propegate
}
MPlayListWidget.prototype.handleMoveEvent = function(event) {
		// Check for an empty list
	this.doMove(event.navigateTo);
	return false; // dont propegate
}
MPlayListWidget.prototype.handlePrevEvent = function(event) {
		// Check for an empty list
	this.doPrev();
	return false; // dont propegate
	
	
}
MPlayListWidget.prototype.allowActionPropagation = function() {
	return false;
};
exports["msequence"] = MPlayListWidget;

})();
