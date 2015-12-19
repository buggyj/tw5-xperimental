/*\
title: $:/plugins/bj/mosaic/mosaic.js
type: application/javascript
module-type: widget


\*/


(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MosaicWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tw-close-tiddler", handler: "handleCloseTiddlerEvent"}
	]);
};

/*
Inherit from the base widget class
*/
MosaicWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/

MosaicWidget.prototype.render = function(parent,nextSibling) {
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create a root domNode to contain our widget
	var domNode = this.create(parent,nextSibling);
	// Assign classes to our domNode
	var classes = this["class"].split(" ") || [];
	classes.push("tw-grid-frame");
	domNode.className = classes.join(" ");
	// Insert the root domNode for this widget
	this.domNodes.push(domNode);
	parent.insertBefore(domNode,nextSibling);
	// Render the child widgets into the domNode
	this.renderChildren(domNode,null);
};

MosaicWidget.prototype.create = function(parent,nextSibling) {
	// Create a simple div element to contain the table
	return this.document.createElement("div");
};

MosaicWidget.prototype.execute = function() {
	// Get the widget attributes
	this.whenEmpty = this.getAttribute("whenEmpty");
	this.index=this.getAttribute("index","0");//reserve 0 for future use
	this.template = this.getAttribute("template");	
	this.wfixed = this.getAttribute("wfixed");
	this.variableName = this.getAttribute("variable","currentTiddler");
	this.prefix = this.getAttribute("prefix","mosaic");
    this.jsontid=this.getAttribute("json",this.prefix);
   	this.json=$tw.wiki.getTiddlerData(this.jsontid,{});
   	this.json[this.index] = this.json[this.index]||[];
	this.rows = parseInt(this.getAttribute("rows","5"),10);
	this.cols = parseInt(this.getAttribute("cols","5"),10);
	this["class"] = this.getAttribute("class","");        //<col style="width:40%">


	// Build the table widget tree  
	var table = {type: "element",tag: "table", children:[],
		attributes: {class: {type: "string", value: "mosaic"}}};
	if (this.wfixed){	
		for(var col=0; col<this.cols; col++) {
			table.children.push({type: "element",tag: "col", children:[],
			attributes: {style: {type: "string", value: "width:"+100/this.cols+"%;" }}});
		}	
	}
		
	var tbody = {type: "element",tag: "tbody", children:[]};	
	for(var row=0; row<this.rows; row++) {
		var tr = {type: "element",tag: "tr", children:[]};	
		for(var col=0; col<this.cols; col++) {
			var td = {type: "element",tag: "td", children:[]};
			var item = this.makeItemTemplate(this.getTableCellTitle(col,row));
			item.row = row;
			item.col = col;
			td.children.push(item);
			tr.children.push(td);
		}
		tbody.children.push(tr);
	}

	table.children.push(tbody);
	// Append the contents enclosed by the grid widget
	var children = [table];
	if (this.parseTreeNode && this.parseTreeNode.children) {
		//children = children.concat(this.parseTreeNode.children);
	}
	// Make all of the child widgets
	this.makeChildWidgets(children);
};


MosaicWidget.prototype.getTableCellTitle = function(col,row) {
	var val;
	try {
		//this.json = (!!this.json)?this.json:$tw.wiki.getTiddlerData(this.jsontid);
		if (this.json[this.index][col]) {
			val=this.json[this.index][col][row];
		}
	  return (!!val)?val:null;
	} catch(e){ 
		
		return null;
	}
};

MosaicWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler || changedAttributes["class"]) {
		this.refreshSelf();
		return true;
	} else {
		if(changedTiddlers[this.jsontid]) {
			
			this.refreshSelf();
			return true;
		}
		else
			return this.refreshChildren(changedTiddlers);
	}
};

/*
Compose the template for a list item
*/
MosaicWidget.prototype.makeItemTemplate = function(title) {

	var tiddler ,
		hasTemplate ,
		template ,
		templateTree;
	
	if (!title) {
		if (this.whenEmpty){
		templateTree = [{type: "transclude", attributes: {tiddler: {type: "string", value: this.whenEmpty}}}];
		} else { //need to give the cell some invisable contain that takes up space, otherwise empty rows colapse
			templateTree = [{type: "element", tag: "img", attributes: {style: 
				{type: "string", value: "float:left;min-height:50px;min-width:50px;visibility:hidden;"}}}];
		} 
	} else {
			// Check if the tiddler has a template
		tiddler = this.wiki.getTiddler(title);
		if( tiddler && tiddler.hasField("template")) {
			template = tiddler.fields.template;
		}
		// Compose the transclusion of the template
		if(template) {
			templateTree = [{type: "transclude", attributes: {tiddler: {type: "string", value: template}}}];
		} else {
			if(this.parseTreeNode.children && this.parseTreeNode.children.length > 0) {
				templateTree = this.parseTreeNode.children;
			} else {
				// Default template is a link to the title
				templateTree = [{type: "element", tag: this.parseTreeNode.isBlock ? "div" : "span", 
								children: [{type: "link", attributes: {to: {type: "string", value: title}}, children: [
						{type: "text", text: title}
				]}]}];
			}
		}
	}
	// Return the list item
	return {type: "cellitem", itemTitle: title, variableName: this.variableName, children: templateTree, listtag:this.listtag};
};
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
MosaicWidget.prototype.setTiddlerCell = function(what,col,row,del) {
	var self = this;
	var update = function(value) {
		var tiddler = self.wiki.getTiddler(self.jsontid),updateFields;
		if (tiddler){
			updateFields = {};
		} else {
			updateFields = {title:self.jsontid,type:"application/json"}
		}
		
		//alert(JSON.stringify(tiddler))
		updateFields["text"] = value;
		self.wiki.addTiddler(new $tw.Tiddler(self.wiki.getCreationFields(),tiddler,updateFields,
		self.wiki.getModificationFields()));
	};
	if (!del) {
		try {	
			this.json[this.index][col][row]='Ꮬ'+what;//BJ should first check to see if any  char of json is Ꮬ - if so use another char for marker
		} catch(e) { 
			try {
				this.json[this.index][col]=[];
				this.json[this.index][col][row]='Ꮬ'+what;//BJ should first check to see if any  char of json is Ꮬ - if so use another char for marker
			}  catch(e) { 
				this.json[this.index] =[];
				this.json[this.index][col]=[];
				this.json[this.index][col][row]='Ꮬ'+what;//BJ should first check to see if any  char of json is Ꮬ - if so use another char for marker
			}
		}
	}
	var pattern=new RegExp('"(Ꮬ?)('+escapeRegExp(what)+')"',"mg");
	var newval = JSON.stringify(this.json,null,2).replace(pattern,
		function(m,key1,key2,offset,str){ 
                if (key1=='Ꮬ') {// our new entry - remove special marker
					return '"'+key2+'"';
				}
				return '""';//remove old entry

		});
	update(newval);
};
// Close a specified tiddler
MosaicWidget.prototype.handleCloseTiddlerEvent = function(event) {
	var title = event.param || event.tiddlerTitle;
	this.setTiddlerCell(title,0,0,true);
	return false;
};
exports.mosaic = MosaicWidget;

/*
Inherit from the base widget class
*/
var ItemWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};
ItemWidget.prototype = new Widget();

ItemWidget.prototype.handleDropEvent  = function(event) {
	var self = this,
		dataTransfer = event.dataTransfer,
		returned = this.nameandOnListTag(dataTransfer);
	
	if (!!returned.name) { //only handle tiddler drops
			var node = this;
	while(node && node.parentWidget) {
		if(!!node.setTiddlerCell) {
			node.setTiddlerCell(returned.name,self.parseTreeNode.col,self.parseTreeNode.row);
			break;
		}
		node = node.parentWidget;
	}
		 //this.parentWidget.parentWidget.parentWidget.setTiddlerCell(returned.name,this.parseTreeNode.col,this.parseTreeNode.row);

		 //cancel normal action
		 this.cancelAction(event);
		 self.dispatchEvent({type: "tw-dropHandled", param: null});

	 }
	 //else let the event fall thru
};

ItemWidget.prototype.handleDragOverEvent  = function(event) {
//alert("OVER")
	// Tell the browser that we're still interested in the drop
	event.preventDefault();
	event.dataTransfer.dropEffect = "copy";
};

ItemWidget.prototype.importDataTypes = [
	{type: "text/vnd.tiddler", IECompatible: false, convertToFields: function(data) {
		return JSON.parse(data);
	}},
	{type: "URL", IECompatible: true, convertToFields: function(data) {
		// Check for tiddler data URI
		var match = decodeURIComponent(data).match(/^data\:text\/vnd\.tiddler,(.*)/i);
		if(match) {
			return JSON.parse(match[1]);
		} else {
			return { // As URL string
				text: data
			};
		}
	}},
	{type: "text/x-moz-url", IECompatible: false, convertToFields: function(data) {
		// Check for tiddler data URI
		var match = decodeURIComponent(data).match(/^data\:text\/vnd\.tiddler,(.*)/i);
		if(match) {
			return JSON.parse(match[1]);
		} else {
			return { // As URL string
				text: data
			};
		}
	}},
	{type: "text/plain", IECompatible: false, convertToFields: function(data) {
		return {
			text: data
		};
	}},
	{type: "Text", IECompatible: true, convertToFields: function(data) {
		return {
			text: data
		};
	}},
	{type: "text/uri-list", IECompatible: false, convertToFields: function(data) {
		return {
			text: data
		};
	}}
];
ItemWidget.prototype.cancelAction =function(event) {
	// Try each provided data type in turn
		{
	var self = this,
		dataTransfer = event.dataTransfer;
	event.preventDefault();
	// Stop the drop ripple up to any parent handlers
	event.stopPropagation();
};
};


ItemWidget.prototype.nameandOnListTag = function(dataTransfer) {
	// Try each provided data type in turn
	var self = this;
	for(var t=0; t<this.importDataTypes.length; t++) {
		if(!$tw.browser.isIE || this.importDataTypes[t].IECompatible) {
			// Get the data
			var dataType = this.importDataTypes[t];
			var data = dataTransfer.getData(dataType.type);
			// Import the tiddlers in the data
			if(data !== "" && data !== null) {
				var tiddlerFields = dataType.convertToFields(data);
				if(!tiddlerFields.title) {
					
					break;
				}
				return {name:tiddlerFields.title};
			}
		}
	};
	return  {name:null, onList:false};
};
/*
Render this widget into the DOM
*/
ItemWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
var domNode = this.document.createElement("div");
	// Add event handlers
	$tw.utils.addEventListeners(this.parentDomNode,[
		{name: "drop", handlerObject: this, handlerMethod: "handleDropEvent"},
		{name: "dragover", handlerObject: this, handlerMethod: "handleDragOverEvent"},	
		]);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	//if (!!this.parseTreeNode.itemTitle) 
	this.renderChildren(this.parentDomNode,null);//BJ may set this behavour as an option??
	//else    domNode.innerHTML='<img style="float:left;min-height:50px;min-width:50px;visibility:hidden;" />';
	this.domNodes.push(domNode);
};

/*
Compute the internal state of the widget
*/
ItemWidget.prototype.execute = function() {
	// Set the current list item title
	if (!!this.parseTreeNode.itemTitle)
			this.setVariable(this.parseTreeNode.variableName,this.parseTreeNode.itemTitle);
	// Construct the child widgets
	this.col =this.parseTreeNode.col;
	this.row =this.parseTreeNode.row;
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ItemWidget.prototype.refresh = function(changedTiddlers) {
	return this.refreshChildren(changedTiddlers);
};

exports.cellitem = ItemWidget;
})();
