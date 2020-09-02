var express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');
const redis=require('redis');const { respreqinvalid } = require('../utils')
const {web3, netkind } = require('../configs/ETH/configweb3')
const {btc}=require('../configs/BTC/configbtc')
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const MSG_ID_DUP='사용할수 없는 아이디입니다'
router.post('/join',(req,res)=>{const {username,pw}=req.body
  if(username && pw){} else {respreqinvalid(res,'ARGMISSING',40761);return false}
  db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
    if(respuser){respreqinvalid(res,MSG_ID_DUP,82532);return false}
    db.users.create({... req.body})
//    db.operations.findOne({raw:true,where:{key_:'CURRENCIES'}}).then(respcurr=>{      const currencies=JSON.parse(respcurr['value_'])
    db.tokens.findAll({raw:true,where:{netkind:netkind}}).then(aresps=>{ let accounteth=web3.createaccount()
      let accountbtc=btc.createaccount() // acct.publicAddress , acct.privateWif
      aresps.forEach(jdata=>{
        if(jdata['group_']=='ETH'){}
        db.balance.create({
          username:username
          , currency:jdata['name']
          , netkind:netkind
          , denominatorexp:jdata['demominatorexp']
          , address:accounteth['address']
          , privatekey:accounteth['privateKey']
          , group_:jdata['group_']
        })
      })
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
