/*\
title: $:/mcore/modules/widgets/mreveal_handler.js
type: application/javascript
module-type: dom_method


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
exports["rv"] = function(upstream,here,domNode) {
	var state = upstream.paramObject.state;//upstream.paramObject.state is the changed state (in a string) sent to use from the source.
	var refreshed = false,
		toOpen;
	
	switch(here.type) {
		case "match":
			toOpen = state === here.text;//alert(state+" state M toopen="+toOpen);
			break;
		case "nomatch":
			toOpen = state === here.text;//alert(state+" state noM toopen"+toOpen);
			toOpen = !toOpen;
			break;
	}
	if(toOpen !== here.isOpen) {

		
		// Animate our DOM node
		if(!here.isOpen) {
			domNode.removeAttribute("hidden");
			if (typeof $tw !== "undefined" && $tw.anim) $tw.anim.perform(here.openAnimation,domNode);
			here.isOpen = true;
		} else {
			if (typeof $tw !== "undefined" && $tw.anim) {
				$tw.anim.perform(here.closeAnimation,domNode,{callback: function() {
					domNode.setAttribute("hidden","true");
				}});
			} else domNode.setAttribute("hidden","true");
			here.isOpen = false;
		} 
		
	} else {}//alert(state+" state M isopen"+this.isOpen +" toopen"+toOpen+"text"+this.text);}
};


})();
