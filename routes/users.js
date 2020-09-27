var express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');
const redis=require('redis');const { respreqinvalid, respok,generateRandomStr,getip,delsession,hasher,callhook} = require('../utils')
const configweb3= require('../configs/ETH/configweb3'); const {web3,nettype}=configweb3
const configbtc =require('../configs/BTC/configbtc'); const {bitcore:btc}=configbtc
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient(); const _=require('lodash')
const messages=require('../configs/messages'); const SITENAME_DEF='IOTC',RANDOM_PW_LEN=10;const MSG_ID_DUP_LOCAL='ID in use'
const configs=require('../configs/configs'); const {queuenamesj}=configs
const {enqueuedataj}=require('../reqqueue/enqueuer')
router.post('/create',async(req,res)=>{let {username,sitename}=req.body;console.log(req.body)
  if(username && sitename){} else {respreqinvalid(res,'ARG-MISSING',40761);return false} //  if(MAP_SITENAME[sitename]){} else {respreqinvalid(res,'ARG-MISSING',40762); ifsitename=SITENAME_DEF}
  sitename=sitename.toUpperCase()
  if(await db.sitenameholder.findOne({raw:true,where:{sitename:sitename}})){} else {respreqinvalid(res,'SITENAME-INVALID',64749);return false}
  const pw=generateRandomStr(RANDOM_PW_LEN)
  db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
    if(respuser){respreqinvalid(res,MSG_ID_DUP_LOCAL,82532);return false}
    db.users.create({username:username,pw:pw,sitename:sitename,active:1,pwhash:hasher(pw),createpath:'CREATE'}) //    db.operations.findOne({raw:true,where:{key_:'CURRENCIES'}}).then(respcurr=>{      const currencies=JSON.parse(respcurr['value_'])
    let accounteth,accountbtc
    let _arespsrates = db.exchangerates.findAll({raw:true,where:{sitename:sitename,nettype:nettype,active:1}})
    let _arespstokens= db.tokens.findAll({raw:true,where:{nettype:nettype,nettype:nettype}})
    Promise.all([_arespsrates,_arespstokens]).then(aresps=>{      const resprates=aresps[0];      const resptokens=aresps[1]
      accounteth=configweb3.createaccount() // web3.createaccount()
      accountbtc=configbtc.createaccount() ;  let account=null,netkind // acct.publicAddress , acct.privateWif      
      console.log(accountbtc,accounteth) // ;return false
      const jtokens=_.fromPairs(_.map(resptokens, e => [e.name, e ]))
      resprates.forEach(ratedata=>{ let netkind,nettype
        const jdata=jtokens[ratedata['currency0']]; if (jdata){} else {console.log(`Data missing-${ratedata['currency0']}`);return false}
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
          ,canwithdraw:ratedata['canwithdraw']
          , amount:0          , amountfloat:0,amountstr:0,active:1
        })
      })
      respok(res,null,null)
      enqueuedataj(queuenamesj['ADDR-TOKEN'], {flag:'ADD', username:username,address:accounteth['address'] })
      enqueuedataj(queuenamesj['ADDR-ETH'] ,  {flag:'ADD', username:username,address:accounteth['address'] })
      enqueuedataj(queuenamesj['ADDR-BTC'] ,  {flag:'ADD', username:username,address:accountbtc['address'] })            
      callhook({name:username,path:'join'});return false
    })
  })
})

router.post('/join',(req,res)=>{let {username,pw,sitename}=req.body; if(sitename){} else {sitename=SITENAME_DEF}
	if(username && pw && sitename){} else {respreqinvalid(res,'ARGMISSING',40761);return false}
	sitename=sitename.toUpperCase()
  db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
    if(respuser){respreqinvalid(res,messages.MSG_ID_DUP,82532);return false}
    db.users.create({username:username,pw:pw,sitename:sitename,active:1,pwhash:hasher(pw),createpath:'JOIN'}) //    db.operations.findOne({raw:true,where:{key_:'CURRENCIES'}}).then(respcurr=>{      const currencies=JSON.parse(respcurr['value_'])
    let accounteth,accountbtc
    let _arespsrates = db.exchangerates.findAll({raw:true,where:{sitename:sitename,active:1}})
    let _arespstokens= db.tokens.findAll({raw:true,where:{nettype:nettype}})
    Promise.all([_arespsrates,_arespstokens]).then(aresps=>{      const resprates=aresps[0];      const resptokens=aresps[1]
      accounteth=configweb3.createaccount() // web3.createaccount()
      accountbtc=configbtc.createaccount() ;  let account=null,netkind // acct.publicAddress , acct.privateWif      
      console.log(accountbtc,accounteth) // ;return false
      const jtokens=_.fromPairs(_.map(resptokens, e => [e.name, e ]))
      resprates.forEach(ratedata=>{ let netkind,nettype
        const jdata=jtokens[ratedata['currency0']]; if (jdata){} else {console.log(`Data missing-${ratedata['currency0']}`);return false}
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
          ,canwithdraw:ratedata['canwithdraw']
          , amount:0          , amountfloat:0,amountstr:0,active:1
        })
      })
      respok(res,null,null)
      enqueuedataj(queuenamesj['ADDR-TOKEN'], {flag:'ADD', username:username,address:accounteth['address'] })
      enqueuedataj(queuenamesj['ADDR-ETH'] ,  {flag:'ADD', username:username,address:accounteth['address'] })
      enqueuedataj(queuenamesj['ADDR-BTC'] ,  {flag:'ADD', username:username,address:accountbtc['address'] })            
      callhook({name:username,path:'join'});return false
    })
  })
})
router.post('/login',async(req,res)=>{const {username,pw,sitename}=req.body; console.log(req.body)
  if(username && pw){} else {respreqinvalid(res,'ARGMISSING',68961);return false}
  db.users.findOne({raw:true,where:{... req.body,active:1}}).then(async resp=>{
    if(resp){} else {respreqinvalid(res,'INVALID',76323);return false}
    const aexrates=await db.exchangerates.findAll({raw:true,where:{nettype:nettype,sitename:sitename,active:1}})
    const atokens=aexrates.map(e=>{return e['currency0']});console.log(atokens)
    const token=generateRandomStr(32)
    respok(res,null,null,{token:token, atokens:atokens});callhook({name:username,path:'login'})
    db.sessionkeys.create({      username:username
      , token:token
      , sitename:sitename
      , useragent:req.headers['user-agent'].substr(0,150).replace(/ /g,'')
      , loginip:getip(req)
    });return false
  })
})
router.post('/logout',(req,res)=>{
  delsession(req)
  respok(res,null,null,{});return false
})

module.exports = router
