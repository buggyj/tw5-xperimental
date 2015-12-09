/*\
title: $:/mcore/modules/widgets/popup_handler.js
type: application/javascript
module-type: dom_method


\*/
(function(){
exports["do-popup"] = function(upstream,here) {

	$tw.popup.triggerPopup({
		domNode: upstream.domNode,
		title: here.popup,
		msg: true,
		wiki: null//not needed when sending msg
	});
};
})();
