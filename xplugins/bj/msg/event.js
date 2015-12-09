/*\
title: $:/mcore/modules/widgets/event.js
type: application/javascript
module-type: widget

base msg widget 

\*/
(function(){
//alert = function () {};
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
//BJ meditation - maybe move to a startup module?
if($tw.browser) {
		$tw.domextra = new $tw.utils.domextra();
}
var count = 0;//used as part of the unique id for each widget

var intra = "event";

var Widget = require("$:/bj/modules/widgets/msgwidget.js").msgwidget;

var SendMessageWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.count = count++;
};

/*
Inherit from the base widget class
*/
SendMessageWidget.prototype = new Widget();

SendMessageWidget.prototype.wtype = intra;

SendMessageWidget.prototype.etype = null;

SendMessageWidget.prototype.handler = null;
/*
Render this widget into the DOM
*/
SendMessageWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
	if (this.handler) this[this.handler] = $tw.modules.applyMethods("dom_method")[this.handler];

};
/*
Compute the internal state of the widget
*/
SendMessageWidget.prototype.execute = function() {
	var self = this;

	
	this.here = Object.create(null);//hold the values for the dowmsteam dynamic
;
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) !== "$") {
			self.here[name] = attribute;
		}
	});
	
	if (!this.etype) this.etype = this.getAttribute("$event","");
	if (!this.handler) this.handler = this.getAttribute("$handle","");
	
	this.here.tiddlerTitle = this.getVariable("currentTiddler");
	this.here.storyTiddler = this.getVariable("storyTiddler");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
SendMessageWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return true;
};

/*Remove event handlers
*/
SendMessageWidget.prototype.removeChildDomNodes = function() {
//no childern with this widget - just remove event handler
	this.delIdEventListeners([
		{handler: this.handlename, id:this.id+'/'+ this.msgType}
	]);
};
/*
Invoke the init action associated with this widget
*/
SendMessageWidget.prototype.invokeInitAction = function(triggeringWidget,event) { //use addIdEventListener
// set up the static part of the upstream.- 
// receive the item to listen for
// setup incomming messge	
	this.id = event.id;//incomming id
	this.msgType = event.msgTypePreamble+this.etype;
	
	//expose the name of the handler in the central table
		/////////////	
	this[this.wtype+this.count] = this.handleEvent;
	this.handlename = this.wtype+this.count;
	///////////	



//pass the state of the widget into the central table via here (as the upstream listener) - this is the dynamic structure.

this.addIdEventListeners([
		{id:this.id+'/'+this.msgType, handler: this.handlename, aux:this.here, dom_method:this.handler}
	]);
	return this.etype;
};
/*
Invoke the down stream action associated with receiving an upstream event
*/
SendMessageWidget.prototype.handleEvent = function(event,aux) {
     //alert(event.domeNode+aux.popup)
	// invoke handler
	this[this.handler](event,aux);

}

exports[intra] = SendMessageWidget;//event

})();
