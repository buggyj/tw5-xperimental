/*\
title: $:/bj/modules/widgets/bjforms/default.js
type: application/javascript
tags:  $:/tags/bjforms
module-type: library
\*/

exports.name ="default";
exports.run  = function(node,vals,title) {
		vals['title'] = title;//this.tiddlertitle;
		this.wiki.addTiddler(new $tw.Tiddler(this.wiki.getCreationFields(),vals,this.wiki.getModificationFields()));
		
}

