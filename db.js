const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://mongouser:BgJeKFcZDH2U76md@cluster0.8cxbrip.mongodb.net/toDoApp-YAS?retryWrites=true&w=majority";
const client = new MongoClient(uri);


async function start(){
    client.connect()
    .then(()=>{
        console.log('Mongo is connected');
        module.exports = client.db()
        const {app,PORT} = require('./app');
        app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
    })
}

start();

