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
	clearAll: function (){
	    // clears all data from local storage
	    Storage.items = null;
	    Storage.db.removeItem(Storage.key);
	},
	getData: function(){
	    return Storage.items;
	},

	init: function(){
	    // initialises database session
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
	    // saves items to local storage
	    Storage.save(items);
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
	clearBtn: "clear-btn",
	deleteItemBtn: "delete-item-btn",
	editIcon: "edit-icon",
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
	clearBtn: document.getElementById(Selectors.clearBtn),
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
	addItem: function(item){
	    // adds single item to ui list
	    addNewListItem(item);
	},
	addItems: function(items){
	    // adds list of items to ui list
	    items.forEach((item) => {
		addNewListItem(item);
	    });
	},
	clearInput: function(){
	    // clears ui input fields
	    clearFields();
	},
	getElements: function(){
	    // returns selected ui elements
	    return uiElements;
	},
	deleteAllListItems: function(){
	    // deletes all ui list items
	    const itemsList = uiElements.itemsList;
	    const listItems = Array.from(itemsList.children);
	    listItems.forEach(item => {
		itemsList.removeChild(item);
	    });
	},
	deleteListItem: function(itemId){
	    // deletes single ui list item
	    const itemsList = uiElements.itemsList;
	    const listItem = getListItem(itemId, itemsList);
	    itemsList.removeChild(listItem);
	},
	getUserInput: function(){
	    // gets and returns user input
	    return {
		name: uiElements.itemInput.value,
		calories: uiElements.calorieInput.value
	    }
	},
	getSelectors: function(){
	    // returns all document element selectors
	    return Selectors;
	},
	hideList: function(){
	    // hides ui items' list
	    uiElements.itemsList.style.display = "none";
	},
	loadEditState: function(itemToEdit){
	    // sets ui in edit state
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
	    // sets ui in home state
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
	    // update a list item's values
	    const listItems = Array.from(uiElements.itemsList.children);
	    const listItem = listItems.filter(item => {
		return item.id == itemId;
	    })[0];
	    replaceLiContent(listItem, updatedItem);
	},
	showList: function(){
	    // shows ui items' list
	    uiElements.itemsList.style.display = "block";
	},
	updateTotalCalories: function(total){
	    // sets ui total calories to given value
	    uiElements.totalCalories.textContent = `${total}`;
	}
    }
})();


// Item Module
const ItemMgr = (function(){
    // Defines public and private Item attributes

    // Item constructor
    const Item = function(id, name, calories){
	this.id = id;
	this.name = name;
	this.calories = calories;
    };

    // re-calculates and sets totalCalories
    const setTotalCalories = function(){
	let total = 0;
	data.items.forEach(item => {
	    total += item.calories;
	});
	data.totalCalories = total;
    }

    // item internal data structure
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
	    // creates a new Item instance
	    const itemId = id ? id : getNewId();
	    const newItem = new Item(itemId, name, calories);
	    data.update(newItem);
	    return newItem;
	},
	deleteAllItems: function(){
	    // deletes all items from data structure
	    data.items = [];
	    setTotalCalories();
	    data.items;
	},
	deleteCurrentItem: function(){
	    // deletes data structure's current item from
	    // list
	    // returns: updated items list
	    let items = data.items.filter(item => {
		return item.id !== data.currentItem.id;
	    });
	    data.items = items;
	    setTotalCalories();
	    data.currentItem = null;
	    return data.items;
	},
	getCurrentItem: function(){
	    // returns current item
	    return data.currentItem;
	},
	getData: function(){
	    // returns entire data object
	    return data;
	},
	getItemById: function(id){
	    // gets and returns element with given id
	    // designed to never fail
	    const item = data.items.find(item => {
		return item.id === id;
	    });
	    return item;
	},
	getItems: function(){
	    // returns list of all items
	    return data.items;
	},
	setCurrentItem: function(item){
	    // sets value of currentItem
	    data.currentItem = item;
	},
	setItems: function(items){
	    // sets value of items in data structure
	    // to new value
	    data.items = items;
	},
	totalCalories: function(){
	    // returns value of total calories
	    return data.totalCalories;
	},
	unsetCurrentItem: function(){
	    // unsets value of current item in data structure
	    data.currentItem = null;
	},
	updateItemValues: function(item, newValues){
	    // updates values of item with given values
	    item.name = newValues.name;
	    item.calories = parseInt(newValues.calories);
	    setTotalCalories();
	}
    }
})();
