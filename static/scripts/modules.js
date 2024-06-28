#!/usr/bin/node

// Storage Module



// UI module
const UIMgr = (function(){
    console.log("UI manager loaded...");

    // Define all UI Selectors
    const Selectors = {
	itemsList: "items-list",
	totalCalories: "total-calories"
    };

    // add item to List
    const addNewListItem = function(item){
	const li = document.createElement("li");
	li.id = `${item.id}`;
	li.className = "collection-item";
	li.innerHTML =
	    `<strong>${item.name} : </strong><em> ${item.calories} \
Calories</em><a class="secondary-content waves-effect waves-light">\
<i class="fa-solid fa-pencil"></i></a>`;

	document.getElementById(Selectors.itemsList).
	    insertAdjacentElement('beforeend', li);

	console.log(`${item.name} added`);
    };



    // Public attributes
    return {
	addItem: function(item){
	    addNewListItem(item);
	},

	addItems: function(items){
	    items.forEach((item) => {
		addNewListItem(item);
	    });
	},

	getSelectors: function(){
	    return Selectors;
	},

	updateTotalCalories: function(newTotal){
	    document.querySelector(`.${Selectors.totalCalories}`).
		textContent = `${newTotal}`;
	}
    }
})();



// Item Module
const ItemMgr = (function(){
    const Item = function(id, name, calories){
	this.id = id;
	this.name = name;
	this.calories = calories;
    }

    const data = {
	items: [],
	totalCalories: 0,
	currentItem: null,
	update: function(item){
	    data.items.push(item);
	    data.totalCalories += item.calories;
	}
    }




    // Public properties
    return {
	createItem: function(name, calories){
	    const newItem = new Item(getNewId(), name, calories);
	    data.update(newItem);
	    UIMgr.addItem(newItem);
	    UIMgr.updateTotalCalories(data.totalCalories);
	},

	getData: function(){
	    return data;
	},

	getItems: function(){
	    return data.items;
	}
    }
})();
