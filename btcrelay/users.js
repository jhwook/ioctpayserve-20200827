
const request=require('request')
var express = require('express')
var router = express.Router()
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
const headers = {  "content-type": "text/plain;" }
const USER='root',PASSWORD='b8P9hiHAAD'
const optionscommon = { url: `http://${USER}:${PASSWORD}@127.0.0.1:18332/`,method: "POST", headers: headers, body: null}
router.post('/signrawtransactionwithkey',(req,res)=>{
  
})
router.post('/createrawtransaction',(req,res)=>{const {datastr}=req.body
//  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listunspent","params":[1, 1000000, ["${address}"],true,{"minimalamount":0.00001}]}`
  const options={... optionscommon, body:datastr}
  const callback = (error, response, body) => { console.log(error)
    if (!error && response.statusCode == 200) { respok(res,body,null);return false
    }
  }  
  request(options,callback);return false
})
router.get('/listunspent',(req,res)=>{const {address}=req.query
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listunspent","params":[1, 1000000, ["${address}"],true,{"minimalamount":0.00001}]}`
  let options={... optionscommon, body:dataString}
  const callback = (error, response, body) => { console.log(error)
    if (!error && response.statusCode == 200) { respok(res,body,null);return false
    }
  }
  request(options, callback)
})
router.get('/', function(req, res, next) {  res.send('respond with a resource');
});
module.exports = router
// const data = JSON.parse(body)  
{
  status: 'OK',
  message: '{"result":"02000000027efc5d1e7761b04290df56a4dcbbb0e476666f83363d401660cc6a3e37c78d310000000000ffffffffa9b5531078dbb71224680374966825d51500c8dfc456b9906c0b4a02578b68d70100000000ffffffff02a0860100000000001976a914b1385285796de6d4d718bc3644f4146cc0cd387588ac409c0000000000001976a9143637cda4bff30631b420f1a091db3e515b25038988ac00000000","error":null,"id":"curltest"}\n',
  code: null
}