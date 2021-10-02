const ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:2333"
var mongo;

const express = require('express');

var app = express();
var api = express.Router();

async function connectMongo()
{
    return new Promise((resolve, reject)=>{
        MongoClient.connect(url, (err, db)=>{
            if(err) reject(err);

            resolve(db);
        })
    })
}

async function getNewPort()
{
    let port;
    try {
        mongo = await connectMongo();
    } catch (error) {
        console.log(error);
    }
    let db = mongo.db("fksign");
    let where = {
        "_id": ObjectId("6154837ec953e9b6369f9a73")
    }
    
    async function queryPort()
    {
        return new Promise((resolve, reject)=>{
            db.collection("data").find(where).toArray((err, result)=>{
                if(err) reject(err);
                resolve(result[0].port);
            })
        })
    }

    async function updatePort(newPort)
    {
        return new Promise((resolve, reject)=>{
            let update = {
                $set: {"port": newPort}
            }
            db.collection("data").updateOne(where, update, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            })
        })
    }

    port = await queryPort();
    await updatePort(port + 1);
    return port;
}

api.get('/GetNewPort', async (req, res)=>{
    let port = await getNewPort();
    res.send(port.toString());
})

app.use("/api", api);
app.listen(3000, ()=>{console.log("listening...")})