/*\
title: $:/mcore/modules/utils/dom/timer.js
type: application/javascript
module-type: utils
\*/

(function(){

exports["bjGlogalTimer"] = {
	registered: [],
	tickers:[],
	jsTimer: 0,
	Inf : 8640000000000000, // Sat Sep 13 275760 01:00:00 GMT+0100 (BST)!
	register: function(instance){
		if(this.registered.length === 0){
			this.jsTimer = setInterval(this.updateFunc.bind(this), 1000);
		}
		var dateTimeout;
		
		if (!instance.timeout)  {
			dateTimeout = new Date(this.Inf);
		}
		else { 
			dateTimeout = new Date(instance.timeout);
		}
		var listItem = {instance:instance, dateTimeout:dateTimeout};

		this.registered.push(listItem);
		//sort on date order (descending);
		this.registered.sort(function(a, b){return a.dateTimeout-b.dateTimeout});  
		//add to periodic list 
		if (instance.onTick) {
			this.tickers.push(instance);
		}		
	},
	unregister: function(instance){
		//external api
		function getInstance (arr, value) {
			var result  = arr.filter(function(o){return o.instance == value;} );
			return result? result[0] : null; //value should be unique
		}

		var item = getInstance(this.registered,instance);
		if(item){
			var pos = this.registered.indexOf(item);
			this.registered.splice(pos, 1);
			if(this.registered.length === 0){
				clearInterval(this.jsTimer);
			}
			//if it was a ticker remove from ticker list.
			var index = this.tickers.indexOf(instance);
			if (index != -1) {
				this.tickers.splice(index, 1);
			}
		} 
	},

	updateFunc: function(){
	//check next timeout
		var now = new Date();
		var self = this;
		var listTop = this.registered[0]||null;
		while (listTop && (listTop.dateTimeout - now <= 0)) {
			if (listTop.instance.onTimeout) {
				var rep;
				//if user has set a final method
				if(rep=listTop.instance.onTimeout()) {
					this.register(rep);
				}
			}
			shift();			
			listTop = this.registered[0]||null;
		}	
		//update tickers
		var localtickers = this.tickers.slice(0);
		for(var i = 0; i < localtickers.length; i++){
			if (localtickers[i].onTick()==true) {
				//return means remove
				this.unregister(localtickers[i]);
			}
		}
		//** return **//
		function shift(instance){
			//remember listItem = {instance:instance, dateTimeout:dateTimeout}
			self.registered.shift();
			if(self.registered.length === 0){
				clearInterval(this.jsTimer);
			}
			//if it was a ticker remove from ticker list.
			var index = self.tickers.indexOf(instance);
			if (index != -1) {
				this.tickers.splice(index, 1);
			}
		}
	}
};

})();
