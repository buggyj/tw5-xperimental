/*\
title: $:/bj/modules/widgets/dotask.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */


var Widget = require("$:/core/modules/widgets/widget.js").widget;

var DoTask = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
	{type: "tm-dotaskstop", handler: "handleDoStopEvent"},
	{type: "tm-mply", handler: "handlePlayEvent"}]);
};

/*
Inherit from the base widget class
*/
DoTask.prototype = new Widget();

/*
Render this widget into the DOM
*/
DoTask.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.currentplayer = false;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.pNode = this.document.createElement("div");

	this.cNode = this.document.createElement("div");
	this.pNode.appendChild(this.cNode);
	// Insert element
	parent.insertBefore(this.pNode,nextSibling);
		this.renderChildren(this.cNode,null);
	this.domNodes.push(this.pNode);

};

DoTask.prototype.ourmedia = function(event) {
		var tid;
		if (this.permissive==="true") return true;
		if ((tid = this.wiki.getTiddler(event.tiddler)) 
			&& (tid.fields.type === "text/vnd.tiddlywiki")) {
			return true;
		}
		return false;
}
DoTask.prototype.invokeAction = function(triggeringWidget,event) {
	if (event.type == "preStart" && this.currentplayer && !this.ourmedia(event)) { 
		this.domNodes[0].setAttribute("hidden","true");
		this.currentplayer = false;
		
	}
	if (event.type == "start" && this.ourmedia(event)) {
		if (!this.currentplayer) {
			this.currentplayer = true;
			this.domNodes[0].removeAttribute("hidden");
		}
		this.handleStartEvent(event);
	}
	return true; // Action was invoked
};
/*
Compute the internal state of the widget
*/
DoTask.prototype.execute = function() {
	// Get our parameters
	this.tabletid = this.getAttribute("$tabletid");
	this.catname = this.getAttribute("$catname");
   	this.onStart = this.getAttribute("$onStart");
	this.onEnd = this.getAttribute("$onEnd");
	this.actEarly = this.getAttribute("$actEarly");
	this.permissive = this.getAttribute("$permissive");
	this.extract = this.getAttribute("$extract");
	this.actions = this.getAttribute("$actions");
	this.id = this.getAttribute("id");
	this.timeOut = parseInt(this.getAttribute("$timeOut","0"));
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
DoTask.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["timeOut"] ) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};
DoTask.prototype.handleStartEvent = function(event) {
	var self = this,
		options = {};
		 this.nodoend=false;
	var pagedata = {data:{}};
		pagedata.data.title=event.tiddler;//allow to be overriden  by following code
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) !== "$") {
			pagedata.data[name] = attribute;
		}
	});
	pagedata.data.category=this.catname;
		if (this.onStart){
			this.dispatchEvent({
			type: this.onStart
		});	
	}		
	if (this.actions) this.invokeActions(this,event);//should i have start and restart actions?

	if(this.actEarly==="true") {
		if (this.extract) {
				pagedata.data.id = this.id
				var outer;
				outer=this.domNodes[0].querySelector("#"+this.id);		
				if (!!outer) pagedata.data.text= outer.outerHTML; 
		}
		self.dispatchEvent({type: "tiddlyclip-create", category:this.catname, pagedata: pagedata, currentsection:null, localsection:this.tabletid});
	}
	try {
			if(this.timerId) {
				clearTimeout(this.timerId);
			}
			this.timerId = setTimeout(	function (){	// Check for an empty list
				self.timerId = null;

					if(self.actEarly!=="true") {
							if (self.extract) {
								pagedata.data.id = self.id
								var outer=null;
								outer=self.domNodes[0].querySelector("#"+self.id);		//change to getelebyid?
								if (!!outer) pagedata.data.text= outer.outerHTML; 							
							}
							self.dispatchEvent({type: "tiddlyclip-create", category:self.catname, pagedata: pagedata, currentsection:null, localsection:self.tabletid});
						}
						if (!self.nodoend &&self.onEnd){
						self.dispatchEvent({
						type: self.onEnd
						});	
					}
				return false; // dont propegate
			},self.timeOut);
			

		} catch(e) {};

	return false; //always consume event
};

DoTask.prototype.handleDoStopEvent = function(event) {
 this.nodoend=true;
};

DoTask.prototype.allowActionPropagation = function() {
	return false;
};
exports.dotask = DoTask;

})();
