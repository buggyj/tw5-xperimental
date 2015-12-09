/*\
title: $:/bj/modules/widgets/widget-extend.js
type: application/javascript
module-type: widget

Extend the dropzone widget to allow other widget to handle drop events 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;
//call depth first removal - facilitates final functionality of widgets
Widget.prototype.removeChildDomNodes = function() {
	$tw.utils.each(this.children,function(childWidget) {
		childWidget.removeChildDomNodes();
	});
	// If this widget has directly created DOM nodes, delete them and exit. This assumes that any child widgets are contained within the created DOM nodes, which would normally be the case
	if(this.domNodes.length > 0) {
		$tw.utils.each(this.domNodes,function(domNode) {
			domNode.parentNode.removeChild(domNode);
		});
		this.domNodes = [];
	} else {
		// Otherwise, ask the child widgets to delete their DOM nodes

	}
};

})();
