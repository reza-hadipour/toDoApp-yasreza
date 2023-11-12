let cors = require('cors');
const PORT = 3002;

const express = require('express');

const {MongoClient,ObjectId} = require('mongodb');
const uri = "mongodb+srv://mongouser:BgJeKFcZDH2U76md@cluster0.8cxbrip.mongodb.net/toDoApp-YAS?retryWrites=true&w=majority";

const sanitizeHtml = require('sanitize-html');

let app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
let db;


async function run(){
    let client = new MongoClient(uri);
    await client.connect();
    console.log('Mongo is connected');
    db = client.db('toDoApp-YAS');
    app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
}

function passwordProtected(req,res,next){
    console.log('Password Protected Function');
    // res.set('WWW-Authenticate' , 'Basic realm="simple Todo App"')
    res.set('WWW-Authenticate' , 'Basic realm="Simple ToDo App"');

    console.log(req.headers.authorization);
    if(req.headers.authorization == "Basic dGVzdDp0ZXN0"){
        next();
    }else{
        res.status(401).end("Authentication Required");
    }
}

app.use(passwordProtected);

app.get('/login',passwordProtected,(req,res)=>{
    res.json('Hello');
})

app.get('/',async (req,res)=>{
    let data = await db.collection('items').find().toArray();
    res.json(data);
})

app.post('/',(req,res)=>{
    let text = sanitizeHtml(req.body?.text || 'Nothing',{allowedTags:['strong'],allowedAttributes:{}});
    db.collection('items').insertOne({text})
    .then(info => {
        res.json({
            id:info.insertedId,text:text
        });
    })
})

app.patch('/',(req,res)=>{
    let text = sanitizeHtml(req.body?.text,{allowedTags:[],allowedAttributes:{}});
    let id = sanitizeHtml(req.body?.id,{allowedTags:[],allowedAttributes:{}});

    db.collection('items').updateOne({_id: new ObjectId(id)},{$set:{text}})
    .then(()=>{
        res.end('Success');
    })
})

app.delete('/:id',(req,res)=>{
    let id = sanitizeHtml(req.params?.id,{allowedTags:[],allowedAttributes:{}});
    console.log('id: ',id);
    if(ObjectId.isValid(id)){
        db.collection('items').deleteOne({_id: new ObjectId(id)})
        .then((info)=>{
            if(info?.deletedCount){
                res.json('Success');
            }else{
                res.json('Failed');
            }
        })
    }else{
        res.json('Delete operation is failed,ID is not valid.')
    }
})


run();