const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoClient=require('mongodb').MongoClient;


app.enable('trust proxy');
app.use((req,res,next)=>{
     if(req.protocol=='https'){
          next();
     }
     else{
          res.redirect('https://${req.hostname}');
     }
})
const path=require('path');
app.use(express.static(path.join(__dirname,"../build")));

app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb',extended: true}))

const mongoUrl = "mongodb+srv://cnq:shub6ham@cluster0-bbiya.mongodb.net/test?retryWrites=true&w=majority"

app.get("/",(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../build","index.html"));
})

app.get('/send',(req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=>{
        if(err) throw err;
        var dbo=db.db('todo-app');
        
        dbo.collection('tasks').find({}).toArray((err,result)=>{
            res.send(result)
        })
    })
})


app.post('/addTask',(req,res)=>{
        mongoClient.connect(mongoUrl,(err,db)=>{
        if(err) throw err;
        var dbo=db.db('todo-app');
        
        dbo.collection('tasks').insertOne({taskName:req.body.tName,date:req.body.tDate,time:req.body.tTime},(err,result)=>{
        if(err) throw err;
        
        else{
            res.send({'status':'added'})
        }
        })
                  
   })
})

app.post('/upDate',(req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=>{
        if(err) throw err;
        var dbo=db.db('todo-app');
        
        dbo.collection('tasks').updateOne({taskName:req.body.update},{$set:{time:req.body.tTime,taskName:req.body.tName,date:req.body.tDate}},(err,result)=>{
        if(err) throw err;
        
        else{
            res.send({'status':'updated'})
        }
        })
                  
   })
})

app.post('/delete',(req,res)=>{
    mongoClient.connect(mongoUrl,(err,db)=>{
        if(err) throw err;
        var dbo=db.db('todo-app');
        
        dbo.collection('tasks').deleteOne({taskName:req.body.tName},(err,result)=>{
        if(err) throw err;
        
        else{
            
            res.send({'status':'deleted'})
        }
        })
                  
   })
})

app.use((req,res)=>{
     res.send("404,not found");
})


app.listen(process.env.PORT || 5000,()=>{
    console.log("server running")
})