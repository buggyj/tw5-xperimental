/*\
title: $:/plugins/bj/plugins/marked/parsers/markapdaper.js
type: application/javascript
module-type: parser

to support inclusions
\*/

(function(){

var marked = require("$:/plugins/bj/plugins/marked/markdown.js");

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

function Astree() {
}


Astree.prototype.start = function() {
	return [];
}

Astree.prototype.add = function(location, item) {
	return location.concat(item);
}

Astree.prototype.html =function(html) {
	if (false) { 
		return  { type:'raw',"html":html}
	} else {
		return  { "type":"text","text":JSON.stringify(html)}
	}
}

Astree.prototype.code =function(code,lang,escaped) 
 { return  { "type":"element","tag":'code',"children":formatchildren(code)}
};

Astree.prototype.blockquote =function(quote) 
 { return  { "type":"element","tag":'blockquote',"children":formatchildren(quote)}
};

Astree.prototype.hr =function() 
 { return  {"type":"element","tag":"hr"}
};

Astree.prototype.list =function(body,ordered) 
 {  
	 return  { "type":"element","tag":ordered ? 'ol' : 'ul',"children":formatchildren(body)}
};

Astree.prototype.listitem =function(text) 
 { return  { "type":"element","tag":'li',"children":formatchildren(text)}
};

Astree.prototype.table =function(header,body) 
 { 
	 return  { "type":"element","tag":'table',
	 children: [{type:"element",tag:"thead",children: formatchildren(header)},
				{type:"element",tag:"tbody",children: formatchildren(body)}]};
};

Astree.prototype.tablerow =function(content) 
 { return  { "type":"element","tag":'tr',"children":formatchildren(content)}
};

Astree.prototype.tablecell =function(content,flags) 
 { 
	if (flags.align) {
		return { "type":"element","tag":flags.header ? 'th' : 'td',
			attributes: {"style": {type: "string", value:'"text-align:' + flags.align + '"'}},
				"children":formatchildren(content)};
	} else {
		return { "type":"element","tag":flags.header ? 'th' : 'td',"children":formatchildren(content)};
	}
};

Astree.prototype.strong =function(text) { 
	return  { "type":"element","tag":'strong',"children":formatchildren(text)}
};

Astree.prototype.em =function(text) 
 { return  { "type":"element","tag":'em',"children":formatchildren(text)}
};

Astree.prototype.codespan =function(text) 
 { return  { "type":"element","tag":'code',"children":formatchildren(text)}
};

Astree.prototype.br =function() 
 { return  { "type":"element","tag":'br'}
};

Astree.prototype.del =function(text) 
 { return  { "type":"element","tag":'del',text:text}
};

Astree.prototype.link =function(href,title,text) 
 { return  { "type":"element","tag":'link',
			attributes: {href: {type: "string",value: href},target: {type: "string", value:"_blank"}},
			"children":formatchildren(text)}
};

Astree.prototype.image =function(href,title,text) 
  { return  { "type":"element","tag":'img',
			attributes: {src: {type: "string",value: href},alt: {type: "string", value:"_bltext"}},
			"children":formatchildren(text)}
			 //if (title) {    out += ' title="' + title + '"';
};



Astree.prototype.paragraph = function(text) {
	return {"type":"element","tag":"p","children":formatchildren(text)};
}

Astree.prototype.heading = function(text, level, raw) {
	return {"type":"element","tag":"h"+level, "children":formatchildren(text)};
}

function formatchildren(arry) {
	var returns = [],txt=false,j=0;
	for (var i = 0; i < arry.length; ++i) {
		if (typeof arry[i]=="string") {
			if (txt===false) {
				returns[j] = {"type":"text","text":arry[i]};
				txt = true;
				j++;
			} else {			
				returns[j-1] = {"type":"text","text":returns[j-1].text + arry[i]};
			}
		} else {
			returns[i] = arry[i];
			txt = false;
			j++;
		}
	}
	return returns;
}







var PostMd = function(type,text,options) {
	var opts;
	if (!!options) {opts = options.parserrules;}

	this.tree =  marked(text, { renderer: new Astree() });
};
exports["text/x-marked"] = PostMd;

})();

