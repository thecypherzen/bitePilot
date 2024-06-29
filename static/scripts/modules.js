#!/usr/bin/node

// Storage Module
const DbMgr = (function(){
    // get an item
    const Db = function(){
	this.db = window.localStorage;
	this.key = "bitePilot";
	this.items = null;
    };

    const Storage = new Db;

    return {
	getData: function(){
	    return Storage.items;
	},

	init: function(){
	    const dbItems = Storage.db.getItem(Storage.key);
	    if (!dbItems){
		Storage.items = [];
	    } else {
		Storage.items = JSON.parse(dbItems);
	    }
	    Storage.save = function(items=null){
		if (items){
		    Storage.items = items;
		}
		Storage.db.setItem(Storage.key,
				   JSON.stringify(Storage.items));
	    }

	    Storage.reload = function(){
		Storage.items =
		    JSON.parse(Storage.db.getItem(Storage.key));
	    }
	},

	saveItems: function(items=null){
	    Storage.save(items);
	},

	saveItem: function(item){
	    Storage.items.push(item);
	    Storage.save();
	}
    }
})();


// UI module
const UIMgr = (function(){

    // Define all UI Selectors
    const Selectors = {
	addItemBtn: "add-item-btn",
	backBtn: "back-btn",
	calorieInput: "calories",
	deleteItemBtn: "delete-item-btn",
	deleteIcon: "delete-icon",
	itemInput: "food-item",
	itemsList: "items-list",
	totalCalories: "total-calories",
	updateItemBtn: "update-item-btn",
    };

    // Select all needed elements
    const uiElements = {
	addItemBtn: document.getElementById(Selectors.addItemBtn),
	backBtn: document.getElementById(Selectors.backBtn),
	calorieInput: document.getElementById(Selectors.calorieInput),
	deleteItemBtn: document.getElementById(Selectors.deleteItemBtn),
	itemInput: document.getElementById(Selectors.itemInput),
	itemsList: document.getElementById(Selectors.itemsList),
	totalCalories: document.
	    querySelector(`.${Selectors.totalCalories}`),
	updateItemBtn: document.getElementById(Selectors.updateItemBtn)
    };

    // add item to List
    const addNewListItem = function(item){
	const li = newListItem(item);
	uiElements.itemsList.insertAdjacentElement('beforeend', li);
    };

    // clear ui input fields
    const clearFields = function(){
	uiElements.itemInput.value = '';
	uiElements.calorieInput.value = '';
    };

    // Public attributes
    return {
	addItem: function(item){ addNewListItem(item); },
	addItems: function(items){
	    items.forEach((item) => {
		addNewListItem(item);
	    });
	},
	clearInput: function(){ clearFields(); },
	getElements: function(){ return uiElements; },
	deleteListItem: function(itemId){
	    const itemsList = uiElements.itemsList;
	    const listItem = getListItem(itemId, itemsList);
	    itemsList.removeChild(listItem);
	},
	getUserInput: function(){
	    return {
		name: uiElements.itemInput.value,
		calories: uiElements.calorieInput.value
	    }
	},
	getSelectors: function(){ return Selectors; },
	hideList: function(){
	    uiElements.itemsList.style.display = "none";
	},
	loadEditState: function(itemToEdit){
	    UIMgr.clearInput();
	    uiElements.addItemBtn.style.display = 'none';
	    [uiElements.updateItemBtn,
	     uiElements.deleteItemBtn,
	     uiElements.backBtn].forEach(element => {
		 element.classList.remove("hidden");
	     });
	    uiElements.itemInput.value = itemToEdit.name;
	    uiElements.calorieInput.value = parseInt(itemToEdit.calories);
	},
	loadHomeState: function(){
	    UIMgr.clearInput();
	    uiElements.addItemBtn.style.display = "inline";
	    [uiElements.updateItemBtn,
	     uiElements.deleteItemBtn,
	     uiElements.backBtn].forEach(element => {
		 if (!(Array.from(element.classList).
		       includes("hidden"))){
		     element.classList.add("hidden");
		 }
	     });
	},
	replaceListItem: function(itemId, updatedItem){
	    const listItems = Array.from(uiElements.itemsList.children);
	    const listItem = listItems.filter(item => {
		return item.id == itemId;
	    })[0];
	    replaceLiContent(listItem, updatedItem);
	},
	showList: function(){
	    uiElements.itemsList.style.display = "block";
	},
	updateTotalCalories: function(total){
	    uiElements.totalCalories.textContent = `${total}`;
	}
    }
})();


// Item Module
const ItemMgr = (function(){
    const Item = function(id, name, calories){
	this.id = id;
	this.name = name;
	this.calories = calories;
    };

    const setTotalCalories = function(){
	let total = 0;
	data.items.forEach(item => {
	    total += item.calories;
	});
	data.totalCalories = total;
    }

    const data = {
	items: [],
	totalCalories: 0,
	currentItem: null,
	update: function(item){
	    data.items.push(item);
	    data.totalCalories += item.calories;
	}
    };


    // Public properties
    return {
	createItem: function(name, calories, id=null){
	    const itemId = id ? id : getNewId();
	    const newItem = new Item(itemId, name, calories);
	    data.update(newItem);
	    return newItem;
	},
	deleteCurrentItem: function(){
	    let items = data.items.filter(item => {
		return item.id !== data.currentItem.id;
	    });
	    data.items = items;
	    setTotalCalories();
	    data.currentItem = null;
	    return data.items;
	},
	getCurrentItem: function(){
	    return data.currentItem;
	},
	getData: function(){
	    return data;
	},
	getItemById: function(id){
	    console.log(`searching item ${id}...`);
	    const item = data.items.find(item => {
		return item.id === id;
	    });
	    return item;
	},
	getItems: function(){
	    return data.items;
	},
	setCurrentItem: function(item){
	    data.currentItem = item;
	},
	setItems: function(items){
	    data.items = items;
	},
	totalCalories: function(){
	    return data.totalCalories;
	},
	unsetCurrentItem: function(){
	    data.currentItem = null;
	},
	updateItemValues: function(item, newValues){
	    item.name = newValues.name;
	    item.calories = parseInt(newValues.calories);
	    setTotalCalories();
	}
    }
})();
