#!/usr/bin/node

console.log("utilities module...");

const getNewId = function(offset=2){
    return (new Date().getTime().toString(36) +
	    Math.random().toString(36).substr(offset));
}
