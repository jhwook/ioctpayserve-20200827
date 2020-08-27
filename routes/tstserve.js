var express = require('express');
var router = express.Router();
const db=require('../models')
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

router.post('/withdraw',(req,res)=>{
  res.status(200).send({status:'OK'});return false
}) //
router.post('/exchange',(req,res)=>{
  res.status(200).send({status:'OK'});return false
})
router.get('/balance',(req,res)=>{  const {currency,username}=req.query
	db.balance.findOne({raw:true,where:{... req.query}}).then(resp=>{
		res.status(200).send({status:'OK',amount:resp.amount,address:resp.address});return false
	})
  //res.status(200).send({status:'OK',amount:100000,exchangerate:12,address:'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH'});return false
})
router.get('/balances', function(req, res, next) {
  res.status(200).send({status:'OK'
    , balances:[
      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']
    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']
  ]
  })
});

module.exports = router;
