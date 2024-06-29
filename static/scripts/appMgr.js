#!/usr/bin/node

const App = (function(UIMgr, ItemMgr, DbMgr){

    const appName = "Bite Pilot";

    //initialize application
    const appInit = function(){
	console.log(`${appName} is initializing...`);

	// Load home state and event listeners
	loadEventListeners();
	DbMgr.init();
	UIMgr.hideList();
	loadStorageItems();
    };

    // load event listeners to ui elements
    const loadEventListeners = function(){
	const uiElements = UIMgr.getElements();
	uiElements.addItemBtn.onclick = addNewItemInput;
	uiElements.itemsList.onclick = editItemInput;
	uiElements.backBtn.onclick = undoEditState;
	uiElements.updateItemBtn.onclick = updateItemInput;
	uiElements.deleteItemBtn.onclick = deleteItemInput;
    };

    // handle add-item button click event
    const addNewItemInput = function(e){
	const values = UIMgr.getUserInput();
	const name = values.name;
	const calories = values.calories;
	if (validEntries(name, calories)){
	    const newItem = ItemMgr.createItem(name, parseInt(calories));
	    UIMgr.addItem(newItem);
	    UIMgr.updateTotalCalories(ItemMgr.totalCalories);
	    UIMgr.clearInput();
	    DbMgr.saveItem(newItem);
	    UIMgr.showList();
	} else {
	    console.log("invalid entry");
	}
	e.preventDefault();
    };

    // handle item delee button click event
    const deleteItemInput = function(e){
	const currentItemId = ItemMgr.getCurrentItem().id
	const newItems = ItemMgr.deleteCurrentItem();
	UIMgr.deleteListItem(currentItemId);
	UIMgr.updateTotalCalories(ItemMgr.totalCalories);
	UIMgr.loadHomeState();
	DbMgr.saveItems(newItems);
	e.preventDefault();
    };

    // handle item edit icon click event
    const editItemInput = function(e){
	const delIcon = UIMgr.getSelectors().deleteIcon;
	if (e.target.parentNode.id == delIcon ||
	   e.target.id == delIcon){
	    const itemId = e.target.id == delIcon ?
		  e.target.parentNode.id :
		  e.target.parentNode.parentNode.id;
	    const itemToEdit = ItemMgr.getItemById(itemId);
	    UIMgr.loadEditState(itemToEdit);
	    ItemMgr.setCurrentItem(itemToEdit);
	}
	e.preventDefault();
    };

    // load items in storage to ui and items
    const loadStorageItems = function(){
	const dbItems = DbMgr.getData();
	let newItems = dbItems.map((item) => {
	    return ItemMgr.createItem(item.name, item.calories, item.id);
	});
	UIMgr.addItems(newItems);
	UIMgr.updateTotalCalories(ItemMgr.totalCalories);
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

    const updateItemInput = function(e){
	const updatedInput = UIMgr.getUserInput();
	const itemToUpdate = ItemMgr.getCurrentItem();
	ItemMgr.updateItemValues(itemToUpdate, updatedInput);
	UIMgr.replaceListItem(itemToUpdate.id, itemToUpdate);
	DbMgr.storage.save(ItemMgr.getItems());
	setTimeout(() => {
	    UIMgr.loadHomeState();
	}, 500);
	ItemMgr.unsetCurrentItem();

	e.preventDefault();
    };

    // Public attributes
    return {
	init: function(){
	    appInit();
	},
	getName: function(){ return appName; },
    }
})(UIMgr, ItemMgr, DbMgr);
