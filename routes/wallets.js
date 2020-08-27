var express = require('express');
var router = express.Router();
const {respreqinvalid,convethtowei}=require('../utils')
const db=require('../models')
const {sends}=require('../periodic/ETH/sends')
const redis=require('redis');const clientredis=redis.createClient();const clientredisa=require('async-redis').createClient()
/* GET users listing. */
router.get('/marketprice',(req,res)=>{
  res.status(200).send({status:'OK',marketprice:12345});return false
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

router.post('/withdraw',(req,res)=>{const {amount,address,pw,username}=req.body; console.log(req.body)
  if(amount,address,pw,username){} else {respreqinvalid(res,'필수정보를입력하세요',67648);return false}
  db.users.findOne({raw:true,where:{username:username,withdrawpw:pw}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,'비번이맞지않습니다',59497);return false}
    sends({username:username,rxaddr:address,amt2sendfloat:amount,amt2sendwei:convethtowei(amt2sendfloat)})
    res.status(200).send({status:'OK'});return false
  }).catch(err=>{respreqinvalid(res,err,54726);return false})
}) //
router.post('/exchange',(req,res)=>{
  res.status(200).send({status:'OK'});return false
})
router.get('/balance',async (req,res)=>{  const {currency,username}=req.query
	db.balance.findOne({raw:true,where:{... req.query}}).then(async resp=>{
    const prices=await clientredisa.hget('PRICES','ALL')
		res.status(200).send({status:'OK',amount:resp.amount,address:resp.address,prices:prices});return false
	})
  //res.status(200).send({status:'OK',amount:100000,exchangerate:12,address:'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH'});return false
})
router.get('/balances', (req, res, next)=> {const {username}=req.query
	db.balance.findAll({raw:true,where:{username:username}}).then(aresps=>{
		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amount'],e['address'] ]})})
	})
//  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
});

module.exports = router;
