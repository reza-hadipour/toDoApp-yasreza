const express = require('express');

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://mongouser:BgJeKFcZDH2U76md@cluster0.8cxbrip.mongodb.net/toDoApp-YAS?retryWrites=true&w=majority";

let app = express();
app.use(express.urlencoded({extended:true}));
let db;


async function run(){
    let client = new MongoClient(uri);
    await client.connect();
    console.log('Mongo is connected');
    db = client.db('toDoApp-YAS');
    app.listen(3001,()=>console.log('Server is running'));
}

app.get('/',async (req,res)=>{
    let data = await db.collection('items').find().toArray();
    console.log(data);
    res.json(data);
})


run();