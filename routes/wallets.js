var express = require('express');
var router = express.Router();
const {KEYNAME_MARKETPRICES, POINTSKINDS,A_POINTSKINDS}=require('../configs/configs')
const {respreqinvalid,respwithdata, convethtowei, respok, doexchange,sends}=require('../utils')
const db=require('../models')
const {sendseth}=require('../periodic/ETH/sends')
const redis=require('redis');const utils = require('../utils');
const clientredis=redis.createClient();const clientredisa=require('async-redis').createClient()
/* GET users listing. */
router.get('/marketprice',(req,res)=>{const {currency}=req.query
  db.marketprices.findAll({raw:true,attributes: [[db.sequelize.fn('max', db.sequelize.col('id')), 'maxid']]})
  .then(aresps=>{console.log(aresps);    const {maxid}=aresps[0]
    db.marketprices.findOne({raw:true,where:{id:maxid}}).then(resp=>{const jdata={};jdata['marketprice']=resp[currency];      respok(res,null,null,jdata)
    })
  }).catch(err=>{respreqinvalid(res)}) //  res.status(200).send({status:'OK',marketprice:12345});return false
})
router.get('/transactions',(req,res)=>{
  res.status(200).send({status:'OK'
    , txs:[
      {from:'3N5jVaj3qTbiCuBF22ZNBK43ENEgw6J6P5',to:'',fromamount:'',toamount:'',fromcur:'BTC',tocur:'BTC',direction:'in',createdat:'2020-08-08 22:55:26'}
,      {from:'',to:'0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',fromamount:'',toamount:'',fromcur:'ETH',tocur:'ETH',direction:'out',createdat:'2020-05-09 06:24:11'}
,      {from:'',to:'',fromamount:'',toamount:'',fromcur:'BTC',tocur:'BTC',direction:'change',createdat:'2020-04-11 09:36:52'}
      ]
  })
})
router.get('/exchangerates',(req,res)=>{const {currency0,sitename}=req.query ;console.log(req.query)
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,sitename:sitename}}).then(resp=>{
    respwithdata(res,resp);return false
  }).catch(err=>{    respreqinvalid(res,err.toString(),30379);return false
  })
})
router.post('/withdraw',(req,res)=>{const {amount,address,pw,username,currency}=req.body; console.log(req.body)
  if(amount && address && pw && username){} else {respreqinvalid(res,'필수정보를입력하세요',67648);return false}
  db.users.findOne({raw:true,where:{username:username,withdrawpw:pw}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,'비번이맞지않습니다',59497);return false}  //
//    respok(res);return false
    sends({username:username,rxaddr:address,amt2sendfloat:amount,amt2sendwei:convethtowei(amount)})
//    sendsethkinds({username:username,rxaddr:address,amt2sendfloat:amount,amt2sendwei:convethtowei(amount)})
    res.status(200).send({status:'OK'});return false
  }).catch(err=>{console.log(err); respreqinvalid(res,err.toString(),54726);return false})
}) //
router.post('/exchange',(req,res)=>{let {currency0, amount0,sitename,username}=req.body;console.log(req.body)
  if(currency0 && amount0){} else {respreqinvalid(res,'ARG-MISSING',79654);return false}
  amount0=parseFloat(amount0);  console.log(amount0)
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,sitename:sitename}}).then(resprates=>{
    if(resprates){} else {respreqinvalid(res,'DB-ENTRY-NOT-FOUND',81089);return false}
    db.balance.findOne({where:{currency:currency0,username:username}}).then(respbal=>{
      if(respbal){} else {respreqinvalid(res,'DB-BALANCE-NOT-FOUND',61677);return false}
      const amount0wei=convethtowei(amount0),respbaldata=respbal.dataValues
      if(respbaldata['amount']-respbaldata['amountlocked']>=amount0wei){} else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',30212);return false}
      doexchange(username,req.body,respbal,resprates).then(resp=>{respok(res,null,38800,resp);return false
      }).catch(err=>{respreqinvalid(res,err.toString(),62015);return false})
    })
  })
})
router.post('/exchangeXX',(req,res)=>{  const {currency0, amount0}=req.body
  if(currency0 && amount0 ){} else {respreqinvalid(res,'ARG-MISSING',79655);return false} // && currency1 amount1 && && usernamecurrency1,,amount1,username
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,currency1:currency1}}).then(resprates=>{
    if(resprates){} else {respreqinvalid(res,'DB-ENTRY-NOT-FOUND',81089);return false}
    db.balance.findOne({where:{currency:currency0}}).then(respbal=>{
      if(respbal){} else {respreqinvalid(res,'DB-BALANCE-NOT-FOUND',61677);return false}
      if(respbal['amount']-respbal['amountlocked']>=parseInt(amount0)){} else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',30212);return false}
      doexchange(username,req.body).then(resp=>{        respok(res,null,38800);return false
      }).catch(err=>{respreqinvalid(res,err.toString(),62016);return false})      
    })
  })
  res.status(200).send({status:'OK'});return false
})
router.get('/balance',async (req,res)=>{  const {currency,username}=req.query
  if(username && currency){} else {respreqinvalid(res,'ARGMISSING',64472);return false}
  utils.getbalance(req.query,'float').then(async resp=>{
    const prices=await clientredisa.hget(KEYNAME_MARKETPRICES,'ALL')
    respok(res,null,null,{amount:resp, prices:prices})
  })
if(false){	db.balance.findOne({raw:true,where:{... req.query}}).then(async resp=>{    const prices=await clientredisa.hget(KEYNAME_MARKETPRICES,'ALL');		res.status(200).send({status:'OK',... resp,prices:prices});return false
	})}
  //res.status(200).send({status:'OK',amount:100000,exchangerate:12,address:'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH'});return false
})
router.get('/balances', (req, res, next)=> {const {username}=req.query
  db.balance.findAll({raw:true,where:{username:username}}).then(aresps=>{let a2send=[]
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	})
//  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
});

module.exports = router;
