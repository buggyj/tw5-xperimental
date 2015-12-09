/*\
title: $:/bj/modules/widgets/bjforms.js
type: application/javascript
module-type: widget

bjforms widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var BjformsWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
BjformsWidget.prototype = new Widget();


BjformsWidget.prototype.serialize = function(form, evt, query){
    var evt    = evt || window.event;
    var target = evt.target || evt.srcElement || null;
    var field;
    query = query  || {};
    if(typeof form == 'object' && form.nodeName == "FORM"){
        for(var i=form.elements.length-1; i>=0; i--){
            field = form.elements[i];
            if(field.name && !field.disabled && field.type != 'file' && field.type != 'reset'){
                if(field.type == 'select-multiple'){
                    for(j=form.elements[i].options.length-1; j>=0; j--){
                        if(field.options[j].selected){
                            query [field.name] =  field.options[j].value;
                        }
                    }
                }
                else{
                    if((field.type != 'submit' && field.type != 'button') || target == field){
                        if((field.type != 'checkbox' && field.type != 'radio') || field.checked){
                           query [field.name] = field.value;
                        }   
                    }
                }
            }
        }
    }
    return query;
}
/*
Render this widget into the DOM
*/
BjformsWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
	//we now need to find the form and attach a handler
	//if not null?
	if (self.tiddlertitle) {
			var configOptions = $tw.wiki.getTiddlerData(self.tiddlertitle,{}), i;
			for (i in configOptions) {
				try {
					parent.firstElementChild[i].value = configOptions[i];
				} catch (e) {
					
				} 
				
			}
	}
	parent.firstElementChild.addEventListener("submit", function (e) {
		e.preventDefault();
		var vals = self.serialize(this, e);//this, is the dom node
		if (self.macro) {	
			self.macro( this,vals,self.tiddlertitle,self.attributes);
			return false;
		} 
		//else alert("SS")
		 ;
		self.wiki.setTiddlerData (self.tiddlertitle,vals);
		//add override function latter
		//params.push({name: "form", value: form});
		//this.getVariable(this.getAttribute("$refresh"),{params: params};
		return false;
	},false);
		
	parent.firstElementChild.addEventListener("input", function (e) {
		e.preventDefault();
		var vals = self.serialize(this, e);//this, is the dom node
		if (self.macro_oninput) {	
			self.macro_oninput( this,vals,self.tiddleroninput,self.attributes);
			return false;
		} 
		//else alert("SS")
		if (!self.tiddleroninput) return false;
		self.wiki.setTiddlerData (self.tiddlertitle,vals);
		//add override function latter
		//params.push({name: "form", value: form});
		//this.getVariable(this.getAttribute("$refresh"),{params: params};
		return false;
////////////////

	},false);
};

BjformsWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[all[shadows+tiddlers]tag[$:/tags/bjforms]]";
	return this.wiki.filterTiddlers(defaultFilter,this);
}

BjformsWidget.prototype.macro = null;
/*
Compute the internal state of the widget
*/
BjformsWidget.prototype.execute = function() {
	var self = this;
	this.tiddlertitle = this.getAttribute("tiddler","testbjformstitle");
	this.tiddleroninput = this.getAttribute("tiddleroninput");
	//during execution we must setup the users callback - if given
	//* first get list of defined macros
	this.list = this.getTiddlerList();
	//BJ meditation why bother with a list just check it is tagged and is a javascrript module
	// change saver to onSubmit and also provde oninput parameter
	
	
	this.macro_oninput = null;
	$tw.utils.each(this.list,function(title,index) {
		if (title == self.getAttribute("oninput")) {
			try {
				var func = require(title);			
				self.macro_oninput=func.run;
			} catch (e) {
				alert("Bj: problem with user forms handler " + title);require(title);
			} 
		}//else alert(title + self.getAttribute("saver","$:/core/modules/widgets/bjforms/default.js"))
		
	});	//
	this.macro = null;
	$tw.utils.each(this.list,function(title,index) {
		if (title == self.getAttribute("saver","$:/core/modules/widgets/bjforms/default.js")) {
			try {
				var func = require(title);			
				self.macro=func.run;
			} catch (e) {
				alert("Bj: problem with user forms handler " + title);require(title);
			} 
		}//else alert(title + self.getAttribute("saver","$:/core/modules/widgets/bjforms/default.js"))
		
	});	//
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
BjformsWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if($tw.utils.count(changedAttributes) > 0) {
		// Rerender ourselves
		this.refreshSelf();
		return true;
	} 
	//else  
	if (this.getAttribute("$refresh")) {
		var params = this.params.slice(0);
		params.push({name: "changedTiddlers", value: changedTiddlers});
		if (this.getVariable(this.getAttribute("$refresh"),{params: params})) {
					// Rerender ourselves
			this.refreshSelf();
			return true;
		} 
	//else 
	}
	return this.refreshChildren(changedTiddlers);

};

exports.bjforms = BjformsWidget;

})();
