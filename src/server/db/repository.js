const items = new Map();
let counter = 0;

function initItems(){

    items.clear();
    counter = 0;

    createItem("The One Ring", "One ring to rule them all",999666,666999);
    createItem("Infinity Stone", "These Infinity Stones each control an essential aspect of existence.", "",10000);
    createItem("Tom Riddle's Diary", "The diary was proof that he was the Heir of Slytherin",50000,40000);
    createItem("Buster Sword", "A large broadsword that has inherited the hopes of those who fight", 60000,20000);
    createItem("Alchemists' Stone", "Supposed ability to transform base metals into precious ones", "",9999);
    createItem("The Twin Blades", "The Twin Blades of Azzinoth are a pair of fel green warglaives", "",9999);

}

function createItem(name, description, currentBid, startingPrice){

    const id = "" + counter;
    counter++;

    const item = {
        id: id,
        name: name,
        description: description,
        currentBid: currentBid,
        startingPrice: startingPrice
    };

    items.set(id, item);

    return id;
}

function deleteItem(id){

    return items.delete(id);
}

function getSingleItem(id){

    return items.get(id);
}

function getAllItems(){

    return Array.from(items.values());
}

function updateItem(item){

    if(! items.has(item.id)){
        return false;
    }

    items.set(item.id, item);
    return true;
}

function getItemsByBid(currentBid){

    return items.values().filter(b => b.currentBid >= currentBid);
}

module.exports = {initItems, getAllItems, getItemsByBid,
    createItem, getSingleItem, updateItem,  deleteItem};
