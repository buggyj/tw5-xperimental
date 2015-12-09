/*\
title: $:/mcore/modules/widgets/mpreveal_handler.js
type: application/javascript
module-type: dom_method

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
exports["pr"] = function(upstream,here,domNode) {
	//note there is a major hack to pass in the domNode that is different in the full and reduced code base.
	var popup = readPopupState(upstream.text);
	if (popup) {
	// Animate our DOM node
		positionPopup(domNode,popup,here.position);
		$tw.utils.addClass(domNode,"tc-popup"); // Make sure that clicks don't dismiss popups within the revealed content
		domNode.removeAttribute("hidden");
		if (typeof $tw !== "undefined" && $tw.anim) $tw.anim.perform(here.openAnimation,domNode);
	} else {
		if (typeof $tw !== "undefined" && $tw.anim) {
			$tw.anim.perform(here.closeAnimation,domNode,{callback: function() {
				domNode.setAttribute("hidden","true");
			}});
		} else domNode.setAttribute("hidden","true");

	} 

};

var positionPopup = function(domNode,popup,position) {
	domNode.style.position = "absolute";
	domNode.style.zIndex = "1000";
	switch(position) {
		case "left":
			domNode.style.left = (popup.left - domNode.offsetWidth) + "px";
			domNode.style.top = popup.top + "px";
			break;
		case "above":
			domNode.style.left = popup.left + "px";
			domNode.style.top = (popup.top - domNode.offsetHeight) + "px";
			break;
		case "aboveright":
			domNode.style.left = (popup.left + popup.width) + "px";
			domNode.style.top = (popup.top + popup.height - domNode.offsetHeight) + "px";
			break;
		case "right":
			domNode.style.left = (popup.left + popup.width) + "px";
			domNode.style.top = popup.top + "px";
			break;
		case "belowleft":
			domNode.style.left = (popup.left + popup.width - domNode.offsetWidth) + "px";
			domNode.style.top = (popup.top + popup.height) + "px";
			break;
		case "belowcenter":
			domNode.style.left = (popup.left + popup.width - domNode.offsetWidth)/2 + "px";
			domNode.style.top = (popup.top + popup.height) + "px";
			break;
		default: // Below
			domNode.style.left = popup.left + "px";
			domNode.style.top = (popup.top + popup.height) + "px";
			break;
	}
}
var readPopupState = function(state) {
	var popupLocationRegExp = /^\((-?[0-9\.E]+),(-?[0-9\.E]+),(-?[0-9\.E]+),(-?[0-9\.E]+)\)$/,
		match = popupLocationRegExp.exec(state);
	// Check if the state matches the location regexp
	// BJ if state looks like a location
	if(match) {
		// If so, we're open
		// Get the location
		return  {
			left: parseFloat(match[1]),
			top: parseFloat(match[2]),
			width: parseFloat(match[3]),
			height: parseFloat(match[4])
		};
		 
	} else {
		return null;
	}
};
})();
