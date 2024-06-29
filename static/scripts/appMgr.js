#!/usr/bin/node

const App = (function(UIMgr, ItemMgr, DbMgr){

    const appName = "Bite Pilot";

    //initialize application
    const appInit = function(){
	// console.log(`${appName} is initializing...`);

	// Load home state and event listeners
	loadEventListeners();
	DbMgr.init();
	UIMgr.hideList();
	loadStorageItems();
    };

    // load event listeners to all ui elements
    const loadEventListeners = function(){
	const uiElements = UIMgr.getElements();
	uiElements.addItemBtn.onclick = addNewItemInput;
	uiElements.itemsList.onclick = editItemAction;
	uiElements.backBtn.onclick = undoEditState;
	uiElements.clearBtn.onclick = clearAllSubmit;
	uiElements.updateItemBtn.onclick = updateItemInput;
	uiElements.deleteItemBtn.onclick = deleteItemInput;

	// disable enter being used for form submission
	document.onkeypress = function(e){
	    if (e.charCode === 13 || e.keyCode === 13 ||
		e.which === 13 || e.code === "Enter"){
		e.preventDefault();
		e.stopPropagation();
	    }
	}
    };

    // handle add-item button click event
    const addNewItemInput = function(e){
	const values = UIMgr.getUserInput();
	const name = values.name;
	const calories = values.calories;
	// proceed only if values are valid
	if (validEntries(name, calories)){
	    const newItem = ItemMgr.createItem(name, parseInt(calories));
	    UIMgr.addItem(newItem);
	    UIMgr.updateTotalCalories(ItemMgr.totalCalories());
	    UIMgr.clearInput();
	    DbMgr.saveItems(ItemMgr.getItems());
	    UIMgr.showList();
	} else {
	    console.log("invalid entry");
	}
	e.preventDefault();
    };

    // handle clear all button click event
    const clearAllSubmit = function(e){
	const emptyList = ItemMgr.deleteAllItems();
	UIMgr.deleteAllListItems();
	UIMgr.hideList();
	UIMgr.updateTotalCalories(ItemMgr.totalCalories());
	DbMgr.saveItems(emptyList);
	e.preventDefault();
    };

    // handle item delee button click event
    const deleteItemInput = function(e){
	const currentItemId = ItemMgr.getCurrentItem().id
	const newItems = ItemMgr.deleteCurrentItem();
	UIMgr.deleteListItem(currentItemId);
	UIMgr.updateTotalCalories(ItemMgr.totalCalories());
	UIMgr.loadHomeState();
	DbMgr.saveItems(newItems);
	// hide list if empty
	if(!newItems.length){
	    UIMgr.hideList();
	}
	e.preventDefault();
    };

    // handle item edit icon click event
    const editItemAction = function(e){
	const editIcon = UIMgr.getSelectors().editIcon;
	// delegate click event to the <i> and <a> tags
	if (e.target.parentNode.id == editIcon ||
	   e.target.id == editIcon){
	    const itemId = e.target.id == editIcon ?
		  e.target.parentNode.id :
		  e.target.parentNode.parentNode.id;
	    const itemToEdit = ItemMgr.getItemById(itemId);
	    UIMgr.loadEditState(itemToEdit);
	    ItemMgr.setCurrentItem(itemToEdit);
	}
	e.preventDefault();
    };

    // load items from storage to ui and items module
    // and update total calories in ui
    const loadStorageItems = function(){
	const dbItems = DbMgr.getData();
	let newItems = dbItems.map((item) => {
	    return ItemMgr.createItem(item.name, item.calories, item.id);
	});
	UIMgr.addItems(newItems);
	UIMgr.updateTotalCalories(ItemMgr.totalCalories());
	if (newItems.length){
	    UIMgr.showList();
	}
    };

    // handle back btn click event
    const undoEditState = function(e){
	UIMgr.loadHomeState();
	ItemMgr.unsetCurrentItem();
	e.preventDefault();
    };

    // handle update btn click event
    const updateItemInput = function(e){
	const updatedInput = UIMgr.getUserInput();
	const itemToUpdate = ItemMgr.getCurrentItem();
	ItemMgr.updateItemValues(itemToUpdate, updatedInput);
	UIMgr.replaceListItem(itemToUpdate.id, itemToUpdate);
	UIMgr.updateTotalCalories(ItemMgr.totalCalories());
	DbMgr.saveItems(ItemMgr.getItems());
	setTimeout(() => {
	    UIMgr.loadHomeState();
	}, 500);
	ItemMgr.unsetCurrentItem();

	e.preventDefault();
    };

    // Public attributes
    return {
	init: function(){
	    // initilizes the application
	    appInit();
	},
	// returns application name.
	getName: function(){ return appName; },
    }
})(UIMgr, ItemMgr, DbMgr);


// Initialize app
App.init();
