/*\
title: $:/mcore/modules/utils/dom/extra.js
type: application/javascript
module-type: utils

\*/
(function(){

var DomExtra = function() {
}

DomExtra.prototype.serialize  = function(form, evt, query){
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

exports.domextra = DomExtra;

})();
