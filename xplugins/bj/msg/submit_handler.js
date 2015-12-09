/*\
title: $:/mcore/modules/widgets/submit_handler.js
type: application/javascript
module-type: dom_method
\*/
(function(){
var reduced = null;
if (typeof $twmodules !== 'undefined') reduced = true;

exports["do-submit"] = function(upstream,here) {
	var widget = this;
	
	   
	var settimers = function(node,vals,title) {
	var self = this;
	var next = new Date(), timejson = {}, interval = 0, offset = 0;
	if (vals.timer1) interval = parseInt(vals.timer1);
	    if (interval > 0) {
		next.setSeconds(next.getSeconds() + interval);	
		timejson.timeout = next.toJSON() ;
		timejson.reps = vals.reps1-1;
		timejson.dur = interval;
		timejson.bell = vals.bell1;		
		timejson.onTimeout = function (){
			var here = Object.create(null), 
			downsteamId = this.bell+'/'+"mtm-play";
			here.text = "";
			reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):widget.dispatchIdEvent(downsteamId,here);
			if (this.reps > 0) {
				var next = new Date();
				next.setSeconds(next.getSeconds() + this.dur);	
				this.timeout = next.toJSON();
				this.reps--;
				return this;
			} 
			
			//if (i==1) return true;
			//return false;
		
		}.bind(timejson) ;
			$tw.utils.bjGlogalTimer.register(timejson);
	}
	next = new Date();
	timejson = {};
	interval = (vals.timer2 ? parseInt(vals.timer2) : 0);

	if (interval> 0) {
		next.setMinutes(next.getMinutes() + offset + interval);	
		offset = offset + interval * vals.reps2;
		timejson.timeout = next.toJSON() ;
		timejson.reps = vals.reps2-1;
		timejson.dur = interval;
		timejson.bell = vals.bell2;	
		timejson.onTimeout = function (){
			var here = Object.create(null), 
			downsteamId = this.bell+'/'+"mtm-play";
			here.text = "";
			reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):widget.dispatchIdEvent(downsteamId,here);
			if (this.reps > 0) {
				var next = new Date();
				next.setMinutes(next.getMinutes() + this.dur);	
				this.timeout = next.toJSON();
				this.reps--;
				return this;
			} 
			
			//if (i==1) return true;
			//return false;
		
		}.bind(timejson) ;
		$tw.utils.bjGlogalTimer.register(timejson);
	}
	next = new Date();
	timejson = {};
	interval = (vals.timer3 ? parseInt(vals.timer3) : 0);

	if (interval> 0) {
		next.setMinutes(next.getMinutes() + offset + interval);	
		offset = offset + interval * vals.reps3;	
		timejson.timeout = next.toJSON() ;
		timejson.reps = vals.reps3-1;
		timejson.dur = interval;
		timejson.bell = vals.bell3;
		timejson.onTimeout = function (){
			var here = Object.create(null), 
			downsteamId = this.bell+'/'+"mtm-play";
			here.text = "";
			reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):widget.dispatchIdEvent(downsteamId,here);
			if (this.reps > 0) {
				var next = new Date();
				next.setMinutes(next.getMinutes() + this.dur);	
				this.timeout = next.toJSON();
				this.reps--;
				return this;
			} 
			
			//if (i==1) return true;
			//return false;
		
		}.bind(timejson) ;
		$tw.utils.bjGlogalTimer.register(timejson);
	}
	next = new Date();
	timejson = {};
	interval = (vals.timer4 ? parseInt(vals.timer4) : 0);

	if (interval> 0) {
		next.setMinutes(next.getMinutes() + offset + interval);	
		offset = offset + interval * vals.reps4;
		timejson.timeout = next.toJSON() ;
		timejson.reps = vals.reps4-1;
		timejson.dur = interval;
		timejson.bell = vals.bell4;
		timejson.onTimeout = function (){
			var here = Object.create(null), 
			downsteamId = this.bell+'/'+"mtm-play";
			here.text = "";
			reduced?$twmodules.dom_method.dispatchIdEvent(downsteamId,here):widget.dispatchIdEvent(downsteamId,here);
			if (this.reps > 0) {
				var next = new Date();
				next.setMinutes(next.getMinutes() + this.dur);	
				this.timeout = next.toJSON();
				this.reps--;
				return this;
			} 
			
			//if (i==1) return true;
			//return false;
		
		}.bind(timejson) ;
		$tw.utils.bjGlogalTimer.register(timejson);
	}
	// now set up count down timer
	timejson = {};
	timejson.display = node.x;
    timejson.start = Date.now();
    timejson.duration = offset * 60;

    timejson.onTick = function() {
		var  diff,
        minutes,
        seconds;

        diff = this.duration - (((Date.now() - this.start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.display.textContent = minutes + ":" + seconds; 

        if (diff <= 0) {
			return true;
        }
    }.bind(timejson) ;
	$tw.utils.bjGlogalTimer.register(timejson);
	//$tw.wiki.setTiddlerData (title,vals);
}
	var vals = $tw.domextra.serialize(upstream.domNode, upstream.e);
	settimers(upstream.domNode, vals, here.tiddler);
	//alert(JSON.stringify(vals))//$tw.wiki.setTiddlerData (here.tiddler,vals); 
};
})();
