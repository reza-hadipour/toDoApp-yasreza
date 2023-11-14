const express = require('express');
const app = express();
const router = require('./routes');

let cors = require('cors');
const PORT = 3002;

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Set protection
app.use(passwordProtected);

// Set router
app.use('/',router);

module.exports = 
{
    PORT,
    app
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