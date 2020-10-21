var express = require('express');
var router = express.Router()
const {A_POINTSKINDS}=require('../configs/configs') // KEYNAME_MARKETPRICES,KEYNAME_UNITS, POINTSKINDS,, KEYNAME_KRWUSD
const { netkind,nettype } = require('../configs/ETH/configweb3')
const db=require('../models')
const {validatekeyorterminate_param}=require('../sso/sso')
const {convweitoeth}=require('../utils')

router.get('/balances', async (req, res, next)=> {  // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await validatekeyorterminate_param(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  db.balance.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename,active:1}}).then(aresps=>{let a2send=[] ;console.log('balances',aresps.length)
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
    res.status(200).send({status:'OK',balances:aresps.map(e=>{return {currency:e['currency']
      , amount:convweitoeth(e['amount']-e['amountlocked'],e['denominatorexp']) 
      , address:e['address']
      , withdrawable:e['canwithdraw'] }})}) //		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	}) //  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
});

router.get('/balances/array', async (req, res, next)=> {  // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await validatekeyorterminate_param(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  db.balance.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename,active:1}}).then(aresps=>{let a2send=[] ;console.log('balances',aresps.length)
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
    res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],convweitoeth(e['amount']-e['amountlocked'],e['denominatorexp']) ,e['address'],e['canwithdraw'] ]})}) //		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	}) //  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
});

module.exports = router
