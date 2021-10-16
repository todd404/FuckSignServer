const express = require('express');
const axios = require('axios');

var app = express();
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

    console.log(online_proxies_port);
    return online_proxies_port;
}

api.get('/GetOnlinePort', async (req, res)=>{
    let port = await GetOnlinePort();
    res.send({'online_port': port});
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
app.listen(3001, ()=>{console.log("listening..."); GetOnlinePort()})