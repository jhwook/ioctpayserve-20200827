
const express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');
const redis=require('redis');const { respreqinvalid, respok,generateRandomStr,getip,delsession,hasher,callhook,validateethaddress} = require('../utils')
const configweb3= require('../configs/ETH/configweb3'); const {web3,nettype,netkind}=configweb3
const configbtc =require('../configs/BTC/configbtc'); const {bitcore:btc}=configbtc
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient(); const _=require('lodash')
const messages=require('../configs/messages'); const SITENAME_DEF='IOTC'
const configs=require('../configs/configs'); const {queuenamesj}=configs;const MAX_URLADDRESS_LEN=100
const MSG_PLEASE_INPUT_SITENAME='사이트이름을 입력하세요'
const MSG_DATA_DUP='이미 등록된 이름입니다'
const MSG_SITENAME_INVALID='사이트이름이 유효하지 않습니다',MSG_TOKENNAME_INVALID='토큰이름이 유효하지 않습니다',MSG_ADDRESS_INVALID='토큰주소가 유효하지 않습니다'
const MSG_CONVRATE_INVALID='변환율이 유효하지 않습니다',MSG_FIXEDPRICE_INVALID='고정가격이 유효하지 않습니다',MSG_TOKEN_NOTREGISTERED='등록되지 않은 토큰입니다',MSG_SITETOKEN_NOTFOUND='등록되지 않은 사이트/토큰입니다'
const MSG_DELETED='삭제되었습니다'
const MIN_SITENAME_LEN=3,MIN_TOKENNAME_LEN=3
const MIN_CSKCONVRATE=0,MAX_CSKCONVRATE=100; const MIN_FIXEDPRICE=0,MAX_FIXEDPRICE=10**8
const {getdecimals}=require('../periodic/ETH/tokens/utils');
const { id } = require('ethers/lib/utils');
const MAP_COINS_DECIMALS={BTC:8,ETH:18}
router.delete('/sitenameholder',(req,res)=>{const {sitename}=req.body
  db.sitenameholder.destroy({where:{sitename:sitename}}).then(resp=>{
    respok(res,MSG_DELETED,19774);return false
  })
}) //
router.get('/sitenameholder',(req,res)=>{
  db.sitenameholder.findAll({raw:true}).then(resp=>{    res.status(200).send({status:'OK',sitenameholders:resp});return false
  })
})
router.delete('/sitetoken',(req,res)=>{let {sitename,tokenname}=req.body
  db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,MSG_SITETOKEN_NOTFOUND);return false}
    resp.update({active:0})    // resp.des troy()    
    respok(res,MSG_DELETED,29532);return false
  })
})
router.get('/sitetoken',(req,res)=>{let {sitename,tokenname}=req.query
  if(sitename && tokenname){
    db.exchangerates.findOne({raw:true,where:{currency0:tokenname,sitename:sitename,nettype:nettype}}).then(resp=>{
      if(resp){} else {respreqinvalid(res,MSG_TOKEN_NOTREGISTERED);return false}
      respok(res,null,null,resp);return false
    })
  } else {
    db.exchangerates.findAll({raw:true,where:{nettype:nettype}}).then(resp=>{      res.status(200).send({status:'OK',sitetokens:resp});return false
    })
  }
}) //
router.post('/sitetoken',async(req,res)=>{  let {sitename,tokenname,contractaddress,C,S,K,collectoraddress,fixedprice,isvariableprice,canwithdraw}=req.body; let jdata={}
  sitename=sitename.toUpperCase(),tokenname=tokenname.toUpperCase()
  if(sitename && sitename.length>=MIN_SITENAME_LEN){jdata['sitename']=sitename}     else {respreqinvalid(res,MSG_SITENAME_INVALID);return false}
  if(tokenname && tokenname.length>=MIN_TOKENNAME_LEN){jdata['currency0']=tokenname}  else {respreqinvalid(res,MSG_TOKENNAME_INVALID);return false}
  let decimals
  if(decimals=MAP_COINS_DECIMALS[tokenname]){jdata['address']=null;jdata['denominatorexp']=decimals}
  else {
    if(contractaddress ){
      if( validateethaddress(contractaddress)){jdata['address']=contractaddress;    decimals=await getdecimals(contractaddress) } 
      else {respreqinvalid(res,MSG_ADDRESS_INVALID);return false}
    }
    if(decimals){jdata['denominatorexp']=decimals}
  }
  let jconvrates={C:C,S:S,K:K} // [C,S,K]
  Object.keys(jconvrates).forEach(key=>{const val=jconvrates[key]; if(val){} else {return false}; const rate=val
    if(rate){rate=parseInt(rate);if(rate>=MIN_CSKCONVRATE && rate<=MAX_CSKCONVRATE){jdata[key]=val} else {respreqinvalid(res,MSG_CONVRATE_INVALID,40154);return false}}
  })
  fixedprice=parseFloat(fixedprice)
  if(fixedprice){    if( fixedprice>=MIN_FIXEDPRICE && fixedprice<=MAX_FIXEDPRICE){ jdata['fixedprice']=fixedprice}    else {respreqinvalid(res,MSG_FIXEDPRICE_INVALID);return false}
  }
  isvariableprice=parseInt(isvariableprice);canwithdraw=parseInt(canwithdraw)
  jdata['priceisfixed']=1-isvariableprice; jdata['canwithdraw']=canwithdraw
  if(collectoraddress ){    if(validateethaddress(collectoraddress)){jdata['collectoraddress']=collectoraddress}    else {}  }
  db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname,nettype:nettype}}).then(resp=>{
    if(resp){resp.update(jdata);respok(res,'Updated')}
    else {      db.exchangerates.create(    {... jdata}  ).then(resp=>{    respok(res,'Created')})
    }  
  })
  db.tokens.findOne({raw:true,where:{name:tokenname,nettype:nettype}}).then(resp=>{
    if(resp){return false} else {}
    db.tokens.create({      name:tokenname
      , denominatorexp:decimals
      , sitename:sitename
      , netkind:netkind
      , nettype:nettype
      , canwithdraw:canwithdraw
    })
  })
  db.sitenameholder.findOne({where:{sitename:sitename,nettype:nettype}}).then(resp=>{
    if(resp){} else {      db.sitenameholder.create({        sitename:sitename, nettype:nettype      })
    }
  }) //  db.sitenameholder.des troy()
})
router.post('/sitenameholder',(req,res)=>{const {sitename,urladdress}=req.body; if (sitename && sitename.length>=4){} else {respreqinvalid(res,MSG_PLEASE_INPUT_SITENAME,14574);return false};  console.log(sitename)
  sitename=sitename.toUpperCase()
  db.sitenameholder.findOne({raw:true,where:{sitename:sitename}}).then(resp=>{
    if(resp){      if(urladdress && urladdress.length>=5){}      
      else {respreqinvalid(res,MSG_DATA_DUP,43550);return false}
    }
    if(urladdress){urladdress=urladdress.substr(0,MAX_URLADDRESS_LEN)}
    db.sitenameholder.create({sitename:sitename,urladdress:urladdress,nettype:nettype}).then(resp=>{
      respok(res);return false
    })
  })
})
module.exports = router

