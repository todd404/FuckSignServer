const express = require('express');
const axios = require('axios');

var app = express();
var api = express.Router();

async function getProxyStatus()
{
    let frp_status = await axios.get("http://127.0.0.1:7500/api/proxy/tcp")
    console.log(frp_status.data.proxies)
}

api.get('/GetProxyStatus', async (req, res)=>{
    let port = await getProxyStatus();
    res.send(port.toString());
})

app.use("/api", api);
app.listen(3001, ()=>{console.log("listening..."); getProxyStatus()})