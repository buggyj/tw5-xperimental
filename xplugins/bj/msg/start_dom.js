/*\
title: $:/core/modules/widgets/head_dom.js
type: application/javascript
module-type: head_method

Action start of static dom - in the head eare

\*/
var $twmodules = {}
$twmodules.dom_method = {};
$twmodules.animation = {};


	$tw = {};
	$tw.utils ={};
	$tw.anim ={};
window.onload = function()
//setTimeout(function()
{	
 


	var mod = $twmodules.dom_method;
	//alert("load")
	// first link to central table
	var json = document.getElementById("jsontable");//alert(json.textContent)
	var action = JSON.parse(json.textContent); //alert(action["bt1/bjm-null"])
$tw.msgwidgettable = action;
	// Install the popup manager
	$tw.popup = new $tw.utils.Popup();
	$tw.domextra = new $tw.utils.domextra();

// next connenct button clicks
	var elements = document.getElementsByClassName("event");//alert(elements.length)
	for(var i=0; i<elements.length; i++) { 
		var j = 0;//alert("event"+i)
		var ev;
		while ( ev = elements[i].getAttribute("data-event"+j)) {//alert(ev)
			j++;
			(function (z,k) {
			var ev = z;
			var i = k;
			elements[i].addEventListener(ev,function (event) {
				if (event.cancelable)  event.preventDefault();
				//the id and aux will need to be in the dom. - why is the aux used
				var data = Object.create(null);
				data.domNode = this;
				data.e = event;
				data.$isRef !== true; //indicate that we are sending references to objects
				mod.dispatchIdEvent(this.getAttribute("id")+"/mtm-"+ev,data);	
				//alert(this.getAttribute("id")+"/mtm-"+ev) 
				return true;
			},false);
			
			})(ev,i);
		}
	}
	
	
$tw.utils.getAnimationDuration =function () {return 400}

 $tw.anim.perform = function(type,domNode,options) {
	options = options || {};
	// Find an animation that can handle this type
	var chosenAnimation;
	if (type == "open") chosenAnimation= $twmodules.animation.slide.open;
	else if (type == "close") chosenAnimation= $twmodules.animation.slide.close;
	if(!chosenAnimation) {
		chosenAnimation = function(domNode,options) {
			if(options.callback) {
				options.callback();
			}
		};
	}
	// Call the animation
	chosenAnimation(domNode,options);
};

mod.dispatchIdEvent = function(id, event) {
	var listener = action[id], domNode;
	while (listener) {
//alert(listener.name.substring(0, 2)) 
		//domNode indicates that we have a destination needing connecting to the dom
		if (('domNode' in listener.aux) && (!listener.aux['domNode'])) {
			listener.aux['domNode'] = document.getElementById(listener.name);
		}
		//each widget needs to expose its dom modifying code via a naming convention
		//eg as = action set message,these are used to find their code in the reduced runtime
		//BJ meditiation we can use the non numeric part of the name instead of just the first two letter,
		//that will allow us to have user-defined methods. string.replace(searchvalue,newvalue)
		mod[listener.dom_method](event,listener.aux,listener.aux['domNode']);
		if(!listener.next) {
			return true;
		}
		listener = listener.next
	}
	return true;
}; 

}
