/*\
title: $:/core/modules/widgets/update-timetot.js
type: application/javascript
module-type: dom_method

\*/
(function(){
exports["update-timetot"] = function(upstream,here) {
	
	var serialize = function(form, evt, query){
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
	var vals = serialize(upstream.domNode, upstream.e);

	var self = this,
        val= 0 + vals.timer2*vals.reps2 + vals.timer4*vals.reps4  + vals.timer3*vals.reps3;
        upstream.domNode.x.value = val + ":00"
};
})();
