var express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');
const redis=require('redis');const { respreqinvalid, respok,generateRandomStr,getip,delsession } = require('../utils')
const configweb3= require('../configs/ETH/configweb3'); const {web3,nettype}=configweb3
const configbtc =require('../configs/BTC/configbtc'); const {bitcore:btc}=configbtc
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const messages=require('../configs/messages'); const SITENAME_DEF='IOTC'
router.post('/join',(req,res)=>{let {username,pw,sitename}=req.body; if(sitename){} else {sitename=SITENAME_DEF}
  if(username && pw){} else {respreqinvalid(res,'ARGMISSING',40761);return false}
  db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
    if(respuser){respreqinvalid(res,messages.MSG_ID_DUP,82532);return false}
    db.users.create({username:username,pw:pw})
//    db.operations.findOne({raw:true,where:{key_:'CURRENCIES'}}).then(respcurr=>{      const currencies=JSON.parse(respcurr['value_'])
    db.tokens.findAll({raw:true,where:{nettype:nettype}}).then(aresps=>{ let accounteth=configweb3.createaccount() // web3.createaccount()
      let accountbtc=configbtc.createaccount() ;  let account=null,netkind // acct.publicAddress , acct.privateWif
      console.log(accountbtc,accounteth) // ;return false    
      aresps.forEach(jdata=>{ let netkind,nettype
        if(jdata['group_']=='ETH')      { account=accounteth; netkind=configweb3.netkind, nettype=configweb3.nettype }
        else if(jdata['group_']=='BTC') { account=accountbtc; netkind=configbtc.netkind,  nettype=configbtc.nettype }
        db.balance.create({
          username:username
          , currency:jdata['name']
          , netkind:netkind
          , nettype:nettype
          , denominatorexp:jdata['denominatorexp']
          , address:account['address']
          , privatekey:account['privateKey']
          , group_:jdata['group_']
          , sitename:sitename
        })       
      })
      respok(res,null,null);return false
    })
  })
})
router.post('/login',(req,res)=>{const {username,pw}=req.body
  if(username && pw){} else {respreqinvalid(res,'ARGMISSING',68961);return false}
  db.users.findOne({raw:true,where:{... req.body,active:1}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,'INVALID',76323);return false}
    const token=generateRandomStr(15)
    respok(res,null,null,{token:token})
    db.sessionkeys.create({      username:username
      , token:token
      , loginip:getip(req)
    });return false
  })
})
router.post('/logout',(req,res)=>{
  delsession(req)
  respok(res,null,null,{});return false
})

module.exports = router
