
const express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');
const redis=require('redis');const { respreqinvalid, respok,generateRandomStr,getip,delsession,hasher,validateethaddress,callhook} = require('../utils')
const configweb3= require('../configs/ETH/configweb3'); const {web3,nettype,netkind}=configweb3
const configbtc =require('../configs/BTC/configbtc'); const {bitcore:btc}=configbtc; const {createaccount}=require('../configs/utilscrypto')
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient(); const _=require('lodash')
const messages=require('../configs/messages'); const SITENAME_DEF='IOTC'
const configs=require('../configs/configs'); const {queuenamesj}=configs;const MAX_URLADDRESS_LEN=100
const MSG_PLEASE_INPUT_SITENAME='사이트이름을 입력하세요'
const MSG_DATA_DUP='이미 등록된 이름입니다'
const MSG_SITENAME_INVALID='사이트이름이 유효하지 않습니다(3자 이상)',MSG_TOKENNAME_INVALID='토큰이름이 유효하지 않습니다(3자 이상)',MSG_ADDRESS_INVALID='토큰주소가 유효하지 않습니다'
const MSG_CONVRATE_INVALID='변환율이 유효하지 않습니다',MSG_FIXEDPRICE_INVALID='고정가격이 유효하지 않습니다',MSG_TOKEN_NOTREGISTERED='등록되지 않은 토큰입니다',MSG_SITETOKEN_NOTFOUND='등록되지 않은 사이트/토큰입니다'
const MSG_DELETED='삭제되었습니다',MSG_VALIDTOKEN_NOTFOUND='유효한 토큰이 발견되지 않습니다'
const MIN_SITENAME_LEN=3,MIN_TOKENNAME_LEN=3
const MIN_CSKCONVRATE=0,MAX_CSKCONVRATE=100; const MIN_FIXEDPRICE=0,MAX_FIXEDPRICE=10**8
const {getdecimals}=require('../periodic/ETH/tokens/utils') // ;const { id } = require('ethers/lib/utils');
const MAP_COINS_DECIMALS={BTC:8,ETH:18}
const {enqueuedataj}=require('../reqqueue/enqueuer');
const { MSG_PLEASE_INPUT_DATA } = require('../configs/messages');
const { token } = require('morgan');
const MAP_CURRENCY_ADDRKIND={BTC:'ADDR-BTC',ETH:'ADDR-ETH'}
const getaddrtype4que=currency=>{  let addrkind=MAP_CURRENCY_ADDRKIND[currency]
  if(addrkind){} else {addrkind='ADDR-TOKEN'}
  return addrkind
}
router.post('/sitenameholder/delete',async(req,res)=>{const {sitename}=req.body;console.log(req.body)
  await db.sitenameholder.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.users.update({active:0},{where:{sitename:sitename}})
  await db.balance.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.exchangerates.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  db.balance.findAll({raw:true,where:{sitename:sitename}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}} ).then(respblock=>{        if(respblock){respblock.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency)
      enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })
    })
  })
  respok(res,MSG_DELETED,19774);return false
}) //
router.delete('/sitenameholder',async(req,res)=>{const {sitename}=req.body;console.log(req.body)
  await db.sitenameholder.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.users.update({active:0},{where:{sitename:sitename}})
  await db.balance.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.exchangerates.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  db.balance.findAll({raw:true,where:{sitename:sitename}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}} ).then(respblock=>{        if(respblock){respblock.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency)
      enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })
    })
  })
  respok(res,MSG_DELETED,19774);return false
//  .then(resp=>{    respok(res,MSG_DELETED,19774);return false  }) //  db.sitenameholder.destroy({where:{sitename:sitename}}).then(resp=>{    respok(res,MSG_DELETED,19774);return false  })
}) //
router.get('/sitenameholder',(req,res)=>{callhook({verb:'get',user:'admin',path:'sitenameholder'})
  db.sitenameholder.findAll({raw:true,where:{active:1}}).then(resp=>{    res.status(200).send({status:'OK',sitenameholders:resp});return false
  })
})
router.delete('/sitetoken',async(req,res)=>{let {sitename,tokenname}=req.body;console.log(req.body)
  if(sitename && tokenname){} else {respreqinvalid(res,MSG_PLEASE_INPUT_DATA,79806);return false}
  await db.balance.update({active:0},{where:{sitename:sitename,currency:tokenname,nettype:nettype}})
  await db.balance.findAll({raw:true,where:{sitename:sitename,currency:tokenname,nettype:nettype}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}}).then(respblock=>{if(respbal){respbal.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency) 
      enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })
    })
  })
  db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname,nettype:nettype}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,MSG_SITETOKEN_NOTFOUND);return false}
    resp.update({active:0})    // resp.des troy()
    respok(res,MSG_DELETED,29532);return false
  })
})
router.get('/sitetoken',(req,res)=>{let {sitename,tokenname}=req.query;  callhook({verb:'get',user:'admin',path:'sitetoken'})
  if(sitename && tokenname){
    db.exchangerates.findOne({raw:true,where:{currency0:tokenname,sitename:sitename,nettype:nettype,active:1}}).then(resp=>{
      if(resp){} else {respreqinvalid(res,MSG_TOKEN_NOTREGISTERED);return false}
      respok(res,null,null,resp);return false
    })
  } else {
    db.exchangerates.findAll({raw:true,where:{nettype:nettype,active:1}}).then(resp=>{      res.status(200).send({status:'OK',sitetokens:resp});return false
    })
  }
}) //
router.post('/sitetoken',async(req,res)=>{  let {sitename,tokenname,contractaddress,Crate,Srate,Krate,collectoraddress,fixedprice,isvariableprice,canwithdraw}=req.body; let jdata={}; console.log(req.body)
  callhook({verb:'post',user:'admin',path:'sitetoken'})
  sitename=sitename.toUpperCase(),tokenname=tokenname.toUpperCase()
  if(sitename && sitename.length>=MIN_SITENAME_LEN){jdata['sitename']=sitename}     else {respreqinvalid(res,MSG_SITENAME_INVALID);return false}
  if(tokenname && tokenname.length>=MIN_TOKENNAME_LEN){jdata['currency0']=tokenname}  else {respreqinvalid(res,MSG_TOKENNAME_INVALID);return false}
  let decimals
  if(decimals=MAP_COINS_DECIMALS[tokenname]){jdata['address']=null;jdata['denominatorexp']=decimals}
  else if(contractaddress){
		if( validateethaddress(contractaddress)){    decimals=await getdecimals(contractaddress)
			if(Number.isInteger(parseInt(decimals))){jdata['address']=contractaddress}
			else {respreqinvalid(res,MSG_ADDRESS_INVALID,74582);return false}
		} 
		else {respreqinvalid(res,MSG_ADDRESS_INVALID,38464);return false}
	}
	else {
		const resptkn=await db.tokens.findOne({raw:true,where:{name:tokenname}})
		if(resptkn && resptkn['address'] && resptkn['denominatorexp']){contractaddress=resptkn['address'];decimals=resptkn['decimals']}
		else {respreqinvalid(res,MSG_VALIDTOKEN_NOTFOUND,59107);return false}
	}	
	if(decimals){jdata['denominatorexp']=decimals}
	  
  let jconvrates={C:Crate,S:Srate,K:Krate} // [C,S,K]
  Object.keys(jconvrates).forEach(key=>{const val=jconvrates[key]; if(val){} else {return false}; let rate=val
    if(rate){rate=parseInt(rate);if(rate>=MIN_CSKCONVRATE && rate<=MAX_CSKCONVRATE){jdata[key]=val} else {respreqinvalid(res,MSG_CONVRATE_INVALID,40154);return false}}
  })
  fixedprice=parseFloat(fixedprice)
  if(fixedprice){    if( fixedprice>=MIN_FIXEDPRICE && fixedprice<=MAX_FIXEDPRICE){ jdata['fixedprice']=fixedprice}    else {respreqinvalid(res,MSG_FIXEDPRICE_INVALID);return false}
  }
  isvariableprice=parseInt(isvariableprice);canwithdraw=parseInt(canwithdraw)
  jdata['priceisfixed']=1-isvariableprice; jdata['canwithdraw']=canwithdraw;jdata['nettype']=nettype
  if(collectoraddress ){    if(validateethaddress(collectoraddress)){jdata['collectoraddress']=collectoraddress}    else {}  }
  try{db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname,nettype:nettype}}).then(resp=>{
      if(resp){resp.update({active:1, ... jdata});respok(res,'Updated')}
      else {      db.exchangerates.create(    {... jdata}  ).then(resp=>{;})    }
    })
    db.tokens.findOne({where:{name:tokenname,nettype:nettype}}).then(resp=>{     const jdtkn={      name:tokenname      , denominatorexp:decimals      , sitename:sitename
        , netkind:netkind      , nettype:nettype      , address:contractaddress      , canwithdraw:canwithdraw
      }
      if(resp){resp.update({active:1,... jdtkn} );return false} 
      else {db.tokens.create(jdtkn)}    // raw:true,
    })
    db.sitenameholder.findOne({where:{sitename:sitename,nettype:nettype}}).then(resp=>{    const jdsite={        sitename:sitename, nettype:nettype      }
      if(resp){resp.update({active:1,... jdsite});return false} 
      else {      db.sitenameholder.create(jdsite)    }
    }) //  db.sitenameholder.des troy()
    db.users.findAll({raw:true,where:{sitename:sitename}}).then(async arespsusers=>{
      if(arespsusers){} else {return false}
      arespsusers.forEach(async user=>{const username=user['username']
        let respbal=await db.balance.findOne({where:{sitename:sitename,username:username,currnecy:tokenname}})
        let acct,address
        if(respbal){respbal.update({active:1})}
        else {
          let jdbalcmn={            username:username            ,currency:tokenname            ,netkind:netkind
            ,nettype:nettype            ,sitename:sitename            , amount:0          , amountfloat:0,amountstr:0
          }
          if(contractaddress){
            db.balance.findOne({raw:true,where:{username:username,sitename:sitename,nettype:nettype,currency:'ETH'}}).then(async respbaleth=>{
              if(respbaleth){address=respbaleth['address']
                await db.balance.create({... jdbalcmn
                  ,denominatorexp:decimals
                  ,address:address
                  ,privatekey:respbaleth['privatekey']
                  ,group_:'ETH'
                })
              } else {acct=createaccount('ETH');address=acct['address']
                db.balance.create({... jdbalcmn,denominatorexp:MAP_COINS_DECIMALS['ETH'],address:acct['address'],privatekey:acct['privatekey'],_group:'ETH'})
                db.balance.create({... jdbalcmn,denominatorexp:decimals,address:acct['address'],privatekey:acct['privatekey'],_group:'ETH'})
              }
            })
          } else {  
            if(MAP_COINS_DECIMALS[tokenname]){              acct=createaccount(tokenname);address=acct['address']
              await db.balance.create({... jdbalcmn                ,denominatorexp:MAP_COINS_DECIMALS[tokenname]                ,address:acct['address'] ,privatekey:acct['privatekey']                ,_group:tokenname
              })
            }
          }
        }
        enqueuedataj(queuenamesj[getaddrtype4que(tokenname)], {flag:'ADD', username:username,address:address })
      })
    })
    respok(res,'Created')
  } catch(err){
    respreqinvalid(res,null,12888) // raw:true,
  }
})
const MINSITENAMELEN=3 // 4
router.post('/sitenameholder',(req,res)=>{let {sitename,urladdress}=req.body; if (sitename && sitename.length>=MIN_SITENAME_LEN){} else {respreqinvalid(res,MSG_PLEASE_INPUT_SITENAME,14574);return false};  console.log(req.body)
  sitename=sitename.toUpperCase();callhook({verb:'post',user:'admin',path:'sitenameholder'})
  db.sitenameholder.findOne({where:{sitename:sitename}}).then(resp=>{
    if(resp){
      if(resp.dataValues['active']) {respreqinvalid(res,MSG_DATA_DUP,43550);return false}
      else {resp.update({... req.body, active:1});respok(res);return false}      
    }
//    if(urladdress){urladdress=urladdress.substr(0,MAX_URLADDRESS_LEN)}
    db.sitenameholder.create({sitename:sitename,urladdress:urladdress,nettype:nettype}).then(resp=>{
      respok(res);return false
    })
  })
})
router.get('/ping',(req,res)=>{
	res.status(200).send({status:'OK',message:'ping'});return false
})
module.exports = router

