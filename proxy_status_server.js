const express = require('express');
const axios = require('axios');

var app = express();
var api = express.Router();

async function GetOnlinePort()
{
    let online_proxies_port = new Array;
    let frp_status = await axios.get("http://127.0.0.1:7500/api/proxy/tcp")
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
    res.send(port.toString());
})

app.use("/api", api);
app.listen(3001, ()=>{console.log("listening..."); GetOnlinePort()})