const ItemModel = require('../model/model.js');

const db = require('../db.js').collection('items');
const {ObjectId} = require('mongodb');

const sanitizeHtml = require('sanitize-html');

exports.getData = async(req,res,next)=>{
    let data = await db.find().toArray();
    res.json(data);
}

exports.insertData = async(req,res,next)=>{
    let data = {
        text : sanitizeHtml(req.body?.text || 'Nothing to do',{allowedAttributes : {},allowedTags:['strong']})
    }
    let item = new ItemModel(data);
    // let response = await item.addItem();
    res.json(await item.addItem());
}

exports.updateItem = async(req,res,next)=>{
    let text = sanitizeHtml(req.body?.text || 'Nothing to do',{allowedAttributes : {},allowedTags:[]});
    let id = sanitizeHtml(req.body?.id,{allowedAttributes : {},allowedTags:[]});

    db.updateOne({_id: new ObjectId(id)},{$set: {text}})
    .then((info)=>{
        let result = 'failed';
        if (info.modifiedCount && info.matchedCount){
            result = 'success'
        }
        res.status(200).json({
            status : result
        });
    })
}

exports.deleteItem = async(req,res,next)=>{
    let id = sanitizeHtml(req.params?.id,{allowedAttributes : {},allowedTags:[]});
    console.log('Id: ',id);
    if(ObjectId.isValid(id)){
        db.deleteOne({_id: new ObjectId(id)})
        .then(info=>{
            let result = "failed"
            if(info.deletedCount){
                result = "success"
            }
            res.status(200).json({
                status: result
            })
        })
    }else{
        res.json('Delete operation is failed,ID is not valid.')
    }
}