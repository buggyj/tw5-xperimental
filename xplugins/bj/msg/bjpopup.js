/*\
title: $:/core/modules/utils/dom/popup.js
type: application/javascript
module-type: utils

Module that creates a $tw.utils.Popup object prototype that manages popups in the browser

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Creates a Popup object with these options:
	rootElement: the DOM element to which the popup zapper should be attached
*/
var Popup = function(options) {
	options = options || {};
	this.rootElement = options.rootElement || document.documentElement;
	this.popups = []; // Array of {title:,wiki:,domNode:} objects - bj add msg
	this.widgetmsg = $tw.msgwidgettable; 
};
/*
ask if popped up
*/
Popup.prototype.isPoppedUp = function(domNode) {
	// Check if this popup is already active
	var index = -1;
	for(var t=0; t<this.popups.length; t++) {
		// this will be checked for later 
		if(this.popups[t].domNode === domNode) {
			return true
		}
	}
	return false;
}
/*
Trigger a popup open or closed. Parameters are in a hashmap:
	title: title of the tiddler where the popup details are stored
	domNode: dom node to which the popup will be positioned
	wiki: wiki
	force: if specified, forces the popup state to true or false (instead of toggling it)
*/
Popup.prototype.triggerPopup = function(options) {
	// Check if this popup is already active
	var index = -1;
	for(var t=0; t<this.popups.length; t++) {
		if(this.popups[t].title === options.title) {
			index = t;
		}
	}
	// Compute the new state
	var state = index === -1;
	if(options.force !== undefined) {
		state = options.force;
	}
	 
	// Show or cancel the popup according to the new state
	if(state) {
		this.show(options);
	} else {
		this.cancel(index);
	}
};

Popup.prototype.handleEvent = function(event) {
	if(event.type === "click") {
		// Find out what was clicked on
		var info = this.popupInfo(event.target),
			cancelLevel = info.popupLevel - 1;
		// Don't remove the level that was clicked on if we clicked on a handle
		if(this.isPoppedUp(event.target)||info.isHandle) {
			cancelLevel++;
		}else 
		// Cancel
		this.cancel(cancelLevel);
	}
};

/*
Find the popup level containing a DOM node. Returns:
popupLevel: count of the number of nested popups containing the specified element
isHandle: true if the specified element is within a popup handle
*/
Popup.prototype.popupInfo = function(domNode) {
	var isHandle = false,
		popupCount = 0,
		node = domNode;
	// First check ancestors to see if we're within a popup handle
	while(node) {
		if($tw.utils.hasClass(node,"tc-popup-handle")) {
			isHandle = true;
			popupCount++;
		}
		if($tw.utils.hasClass(node,"tc-popup-keep")) {
			isHandle = true;
		}
		node = node.parentNode;
	}
	// Then count the number of ancestor popups
	node = domNode;
	while(node) {
		if($tw.utils.hasClass(node,"tc-popup")) {
			popupCount++;
		}
		node = node.parentNode;
	}
	var info = {
		popupLevel: popupCount,
		isHandle: isHandle
	};
	return info;
};
var reduced = null;
if (typeof $twmodules !== 'undefined') reduced = true;
/*
Display a popup by adding it to the stack
*/
Popup.prototype.show = function(options) {
	// Find out what was clicked on
	var info = this.popupInfo(options.domNode);
	// Cancel any higher level popups
	this.cancel(info.popupLevel);
	// Store the popup details
	this.popups.push({ //add a msg option
		title: options.title,
		wiki: options.wiki,
		msg: options.msg,
		domNode: options.domNode
	});
	// Set the state tiddler
	// BJ send as message instead if we have a 'msg' option
	// wiki not used to send msg
	if (options.msg) {
		//BJ meditation: we may need to create the message object as a tiddler 
		//to persist - as the reciever may have been 'folded out of the widget tree'
		var here = Object.create(null), 
			downsteamId = options.title+'/'+"mtm-popup";
		here.text = "(" + options.domNode.offsetLeft + "," + options.domNode.offsetTop + "," + 
					options.domNode.offsetWidth + "," + options.domNode.offsetHeight + ")";	
	   reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):dispatchIdEvent(downsteamId,here);	
	   //put the button into 'tc-popup-handle' mode
		$tw.utils.addClass(options.domNode,"tc-popup-handle");
	} else {
		options.wiki.setTextReference(options.title,
				"(" + options.domNode.offsetLeft + "," + options.domNode.offsetTop + "," + 
					options.domNode.offsetWidth + "," + options.domNode.offsetHeight + ")");
		// Add the click handler if we have any popups
	

	}
	if(this.popups.length > 0) {
		this.rootElement.addEventListener("click",this,true);	
	}
};

var dispatchIdEvent = function(id, event) {
	var listener = $tw.msgwidgettable[id], domNode;
	while (listener) {
//alert(listener.name.substring(0, 2)) 

		
		listener.handle(event,listener.aux);
		//pass thru dynamic content

		if(!listener.next) {
			return true;
		}
		listener = listener.next
	}
	return true;
}; 
/*
Cancel all popups at or above a specified level or DOM node
level: popup level to cancel (0 cancels all popups)
*/
Popup.prototype.cancel = function(level) {
	var numPopups = this.popups.length;
	level = Math.max(0,Math.min(level,numPopups));
	for(var t=level; t<numPopups; t++) {
		var popup = this.popups.pop();
		if(popup.title) {
			//if not popup.msg
			if (!popup.msg) {
				popup.wiki.deleteTiddler(popup.title);
			}
			// else  send a msg?
			else {
				//BJ meditation: we may need to create the message object as a tiddler 
				//to persist - as the reciever may have been 'folded out of the widget tree'
				var here = Object.create(null), 
				downsteamId = popup.title+'/'+"mtm-popup";
				here.text = "";
			   reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):dispatchIdEvent(downsteamId,here);	
			   	//pull the button out of 'tc-popup-handle' mode
				$tw.utils.removeClass(popup.domNode,"tc-popup-handle");
	
			}
		}
			
	}
	if(this.popups.length === 0) {
		this.rootElement.removeEventListener("click",this,false);
	}
};

/*
Returns true if the specified title and text identifies an active popup
*/
Popup.prototype.readPopupState = function(text) {
	var popupLocationRegExp = /^\((-?[0-9\.E]+),(-?[0-9\.E]+),(-?[0-9\.E]+),(-?[0-9\.E]+)\)$/;
	return popupLocationRegExp.test(text);
};

exports.Popup = Popup;

})();
