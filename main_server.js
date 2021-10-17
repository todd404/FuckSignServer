const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const logger = require("./logs/logger");

var app = express();
app.use(express.text()) // for parsing application/text
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var api = express.Router();
var file = express.Router();

async function GetOnlinePort()
{
    let online_proxies_port = new Array;
    let frp_status;
    try{
        frp_status = await axios.get("http://127.0.0.1:7500/api/proxy/tcp");
    }catch{
        console.log("Get Frp Online Port Error");
        exit();
    }
    let proxies = frp_status.data.proxies;
    for(p of proxies){
        if(p.status === "online"){
            online_proxies_port.push(p.conf.remote_port);
        }
    }

    return online_proxies_port;
}

api.get('/GetOnlinePort', async (req, res)=>{
    let port = await GetOnlinePort();
    res.send({'online_port': port});
})

api.get('/GetLatestLuaHash', (req, res)=>{
    let stream = fs.createReadStream("./public/test.lua");
    let fsHash = crypto.createHash('md5');
    stream.on('data', function(d){
        fsHash.update(d);
    });

    stream.on('end', ()=>{
        var md5 = fsHash.digest('hex');
        res.send(md5);
    });
})

api.post('/Log', (req, res)=>{
  logger.info(req.body);
  res.send("succsess");
})

file.get('/file/:name', function (req, res, next) {
    var options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })

app.use("/api", api);
app.use("/", file);
app.listen(3001, ()=>{console.log("listening...");})