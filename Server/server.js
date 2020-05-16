const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoClient=require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb',extended: true}))

const mongoUrl = "mongodb+srv://cnq:shub6ham@cluster0-bbiya.mongodb.net/test?retryWrites=true&w=majority"

app.get('/',(req,res)=>{
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
        
        dbo.collection('tasks').insertOne({taskName:req.body.tName,time:req.body.tTime},(err,result)=>{
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
        
        dbo.collection('tasks').updateOne({taskName:req.body.update},{$set:{time:req.body.tTime,taskName:req.body.tName}},(err,result)=>{
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

app.listen(6000,()=>{
    console.log("server running")
})