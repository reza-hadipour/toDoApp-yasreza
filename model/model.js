const dbClient = require('../db').collection('items');

let Item = function(data){
    this.data = data;
}

Item.prototype.addItem = async function()
    {
        let text = this.data.text;
        return dbClient.insertOne({text})
        .then((info) => {
            return {
                id: info.insertedId,
                text:text
            }
        });
    }


module.exports = Item;