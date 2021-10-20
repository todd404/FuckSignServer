const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const md5 = require('md5');
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

function initTimeshift() 
{
    var dCurrent = new Date;
    var month = "" + (dCurrent.getMonth() + 1);
    var date = "" + dCurrent.getDate();
    var year = dCurrent.getFullYear();
    return month.length < 2 && (month = "0" + month), date.length < 2 && (date = "0" + date), [year, month, date].join("-");
}

async function GetClassRoomIdByCourseId(courseId)
{
  let timeStamp = new Date().getTime();
  
  let crsfToken = md5("timestamp=" + timeStamp + ",key=" + "lianyi2019");
  let loginUserTime = md5("qweasd" + initTimeshift());
  console.log(loginUserTime);
  
  let request = axios({
    method: 'GET',
    url: `https://wa.gdupt.edu.cn:8080/arrangeCourseInfo/${courseId}/queryByCourseCode?_t=${timeStamp}`,
    headers:{
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "csrfTimestamp": timeStamp,
      "csrfToken": crsfToken,
      "loginUserTime": loginUserTime
    }
  });

  let response = await request();
  return response;
}

api.post('/GetClassRoomId', async (req, res)=>{
  let courseId = req.body.courseId;
  let classRoomId = await GetClassRoomIdByCourseId(courseId);
  res.send(classRoomId);
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