#!/usr/bin/node

const App = (function(UIMgr, ItemMgr){
    //initialize application
    const appInit = function(msg){
	console.log(msg);

	// Load event listeners

	// Populate items list
	const data = ItemMgr.getData();
	UIMgr.addItems(data.items);
	UIMgr.updateTotalCalories(data.totalCalories);
    }


    return {
	init: function(msg){
	    appInit(msg);
	}
    }
})(UIMgr, ItemMgr);
