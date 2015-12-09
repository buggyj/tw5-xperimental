/*\
title: $:/mcore/modules/widgets/play_handler.js
type: application/javascript
module-type: dom_method

\*/
(function(){
if ($tw.browser || typeof  $twmodules  !== "undefined") {
	var channel_max = 10;										// number of channels
	var audiochannels = new Array();
	for (var a=0;a<channel_max;a++) {									// prepare the channels
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();						// create a new audio object
		audiochannels[a]['finished'] = -1;							// expected end time for this channel
	}
}
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
exports["py"] = function(upstream,here,domNode) {
var node = domNode.firstElementChild;
play_multi_sound(node);
//alert(domNode.firstElementChild.innerHTML )
//alert("node = "+ domNode.firstElementChild.Text )
	function play_multi_sound(node) {

		for (var a=0;a<audiochannels.length;a++) {
			var thistime = new Date();
			if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
				audiochannels[a]['finished'] = thistime.getTime() + node.duration*1000;
				audiochannels[a]['channel'].src = node.src;
				audiochannels[a]['channel'].load();
				audiochannels[a]['channel'].play();
				//alert("node = "+node.src )
				break;
			}
		}
	}
};
})();
