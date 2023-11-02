const PORT = 3002;

const express = require('express');

const {MongoClient,ObjectId} = require('mongodb');
const uri = "mongodb+srv://mongouser:BgJeKFcZDH2U76md@cluster0.8cxbrip.mongodb.net/toDoApp-YAS?retryWrites=true&w=majority";

let app = express();
app.use(express.urlencoded({extended:true}));
let db;


async function run(){
    let client = new MongoClient(uri);
    await client.connect();
    console.log('Mongo is connected');
    db = client.db('toDoApp-YAS');
    app.listen(PORT,()=>console.log('Server is running'));
}

app.get('/',async (req,res)=>{
    let data = await db.collection('items').find().toArray();
    res.json(data);
})

app.post('/',(req,res)=>{
    let text = req.body?.text || 'Nothing';
    db.collection('items').insertOne({text})
    .then(info => {
        res.json({
            id:info.insertedId,text:text
        });
    })
})

app.patch('/',(req,res)=>{
    let {id,text} = req.body;
    db.collection('items').updateOne({_id: new ObjectId(id)},{$set:{text}})
    .then(()=>{
        res.end('Success');
    })
})

app.delete('/',(req,res)=>{
    let {id} = req.body;
    db.collection('items').deleteOne({_id: new ObjectId(id)})
    .then((info)=>{
        if(info?.deletedCount){
            res.json('Success');
        }else{
            res.json('Failed');
        }
    })
})


run();