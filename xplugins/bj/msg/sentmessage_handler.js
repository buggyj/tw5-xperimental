/*\
title: $:/mcore/modules/widgets/sentmessage_handler.js
type: application/javascript
module-type: dom_method

Action widget to send a message

\*/
(function(){
exports["as"] = function(upstream,here) {
	var data ={}, downsteamId;
	upstream= upstream?upstream:Object.create(null);
	// just passes data thru to the down stream, with overrides 
	// Dispatch the message using the user supplied id/type - we are passing data onwards
	downsteamId = here.sendId+'/'+here.sendType;
	//in this widget the 'here' only contains params to be pass forwards - override data passed from upstream
	for (var attrname in upstream) { data[attrname] = upstream[attrname]; }
	for (var attrname in here) { data[attrname] = here[attrname]; }

	this.dispatchIdEvent(downsteamId,data);

};
})();
