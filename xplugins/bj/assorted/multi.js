/*\
title: $:/bj/modules/widgets/bjforms/multi.js
type: application/javascript
tags:  $:/tags/bjforms
module-type: library
\*/

exports.name ="multi";
exports.run  = function(node,vals,title,params) {

	function getAttribute(name,defaultText) {
		if($tw.utils.hop(params,name)) {
			return params[name];
		} else {
			return defaultText;
		}
	};      
	vals['title'] = title;
	var tiddler=new $tw.Tiddler(this.wiki.getCreationFields(),vals,this.wiki.getModificationFields());
//alert(tiddler.fields.title)
	var tiddlers = [tiddler];
    var multititle = getAttribute("multitiddler","testmulti");
	// Get the current $:/Import tiddler
	var importTiddler = $tw.wiki.getTiddler(multititle),
		importData = $tw.wiki.getTiddlerData(multititle,{}),
		newFields = new Object({
			title: multititle,
			type: "application/json",
			"sub-type": "tidtable"
		});

	importData.tiddlers = importData.tiddlers || {};

	importData.tiddlers[tiddler.fields.title] = tiddler.fields;
	// Save the $:/Import tiddler
	newFields.text = JSON.stringify(importData,null,$tw.config.preferences.jsonSpaces);
	$tw.wiki.addTiddler(new $tw.Tiddler(importTiddler,newFields)); 
	// Update the story and history details
}

