
const request=require('request')
var express = require('express')
var router = express.Router()
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
router.post('/createrawtransaction',(req,res)=>{
  
})
router.get('/listunspent',(req,res)=>{const {address}=req.query
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listunspent","params":[1, 1000000, ["${address}"],true,{"minimalamount":0.00001}]}`
  const headers = {  "content-type": "text/plain;" }
  const USER='root',PASSWORD='b8P9hiHAAD'
  var options = {      url: `http://${USER}:${PASSWORD}@127.0.0.1:18332/`,    method: "POST",      headers: headers,      body: dataString
  }
  callback = (error, response, body) => { console.log(error)
    if (!error && response.statusCode == 200) { // const data = JSON.parse(body)  
      respok(res,body,null);return false
    }
  }
  request(options, callback)
})
router.get('/', function(req, res, next) {  res.send('respond with a resource');
});
module.exports = router
