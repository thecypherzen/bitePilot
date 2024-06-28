#!/usr/bin/node

const App = (function(UIMgr, ItemMgr){

    // Get Items from Storage and populate UI
    ItemMgr.createItem("Beans porridge", 600);
    ItemMgr.createItem("Garri", 110);
    ItemMgr.createItem("Rice", 150);


    // Load event listeners


})(UIMgr, ItemMgr);
