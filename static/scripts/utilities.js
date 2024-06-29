#!/usr/bin/node
// Where all utility functions live


// Create a new item id
const getNewId = function(offset=2){
    return (new Date().getTime().toString(36) +
	    Math.random().toString(36).substr(offset));
}

// get list item from items list
const getListItem = function(id, element){
    let matchedItem = Array.from(element.children).filter(
	item => {
	    return item.id == id;
	});
    return matchedItem[0];
}

// create new li element
const newListItem = function(item){
    const li = document.createElement("li");
    li.id = `${item.id}`;
    li.className = "collection-item";
    li.innerHTML =
        `<strong>${item.name} : </strong><em> ${item.calories} \
Calories</em><a id="edit-icon" class="secondary-content waves-effect \
waves-light"><i class="fa-solid fa-pencil"></i></a>`;
    return li;
}


const replaceLiContent = function(li, item){
    li.innerHTML = `<strong>${item.name} : </strong><em> ${item.calories} \
Calories</em><a id="edit-icon" class="secondary-content waves-effect \
waves-light"><i class="fa-solid fa-pencil"></i></a>`;
}

// validate entries
const validEntries = function(name, calories){
    const regexName = /^[_A-Za-z]([\w|\W])*$/;
    const regexCalories = /^[0-9]+$/;
    return (regexName.test(name) &&
	    regexCalories.test(calories));
}
