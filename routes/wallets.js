var express = require('express');
var router = express.Router();
const {KEYNAME_MARKETPRICES,KEYNAME_UNITS, POINTSKINDS,A_POINTSKINDS, KEYNAME_KRWUSD}=require('../configs/configs')
const messages=require('../configs/messages')
const {respreqinvalid,respwithdata, convethtowei, respok, doexchange, generateRandomStr,getip, delsession,getusernamefromsession, convweitoeth  ,callhook
,validatekey,getuserorterminate
}=require('../utils')
const db=require('../models')
const {sends:sendsbtc}=require('../periodic/BTC/sends')
const {sendseth}=require('../periodic/ETH/sendseth')
const {sendstoken}=require('../periodic/ETH/sendstoken') // const {se nds eth,sendstoken}=require('../periodic/ETH/s ends')
const utils = require('../utils');
const { netkind,nettype } = require('../configs/ETH/configweb3')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
/* GET users listing. */
router.get('/marketprice',async (req,res)=>{const {currency}=req.query
  db.marketprices.findAll({raw:true,attributes: [[db.sequelize.fn('max', db.sequelize.col('id')), 'maxid']]})
  .then(aresps=>{console.log(aresps);    const {maxid}=aresps[0]
    db.marketprices.findOne({raw:true,where:{id:maxid}}).then(resp=>{const jdata={};jdata['marketprice']=resp[currency];      respok(res,null,null,jdata)
    })
  }).catch(err=>{respreqinvalid(res)}) //  res.status(200).send({status:'OK',marketprice:12345});return false
})
router.get('/transactions',async (req,res)=>{ // let username; try{username=await getusero rterminate(req,res);if(username){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  db.transactions.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename}}).then(aresps=>{
    res.status(200).send({status:'OK'    , txs:aresps  }) //  res.status(200).send({status:'OK'    , txs:[      {from:'3N5jVaj3qTbiCuBF22ZNBK43ENEgw6J6P5',to:'',fromamount:'',toamount:'',fromcur:'BTC',tocur:'BTC',direction:'in',createdat:'2020-08-08 22:55:26'}      ]  })
    callhook({name:username,path:'TX'})
  })  
})
router.get('/exchangerates',async (req,res)=>{const {currency0,sitename}=req.query ;console.log(req.query)
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,sitename:sitename,active:1}}).then(resp=>{
    respwithdata(res,resp);return false
  }).catch(err=>{    respreqinvalid(res,err.toString(),30379);return false
  })
})
router.post('/withdraw',async  (req,res)=>{  // let username; try{username=await getusero rterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  const {amount,address,pw,currency}=req.body; console.log(req.body)
  if(amount && address && pw && username && currency){} else {respreqinvalid(res,messages.MSG_PLEASE_INPUT_DATA,67648);return false}
  db.users.findOne({raw:true,where:{username:username,withdrawpw:pw,sitename:sitename}}).then(async resp=>{
    if(resp){} else {respreqinvalid(res,messages.MSG_ID_OR_PW_INVALID,59497);return false}  //
//    respok(res);return false
    const tokendata=await db.tokens.findOne({raw:true,where:{name:currency,nettype:nettype}});
    if(tokendata){} else {return false} const decimals=tokendata['denominatorexp']
    sends({username:username,rxaddr:address,amt2sendfloat:parseFloat(amount),amt2sendwei:convethtowei(amount,decimals),currency:currency},'transactions')
//    sendsethkinds({username:username,rxaddr:address,amt2sendfloat:amount,amt2sendwei:convethtowei(amount)})
    res.status(200).send({status:'OK'});
    callhook({name:username,path:'withdraw'});    return false
  }).catch(err=>{console.log(err); respreqinvalid(res,err.toString(),54726);return false})
}) //
const HEADER_LOG_STOP_TX='stop admin tx:'
const sendstoadminonexchange=async (jdata,username)=>{let {currency0,sitename}=jdata // ; amount0=parseFloat(amount0)
  db.operations.findOne({raw:true,where:{key_:'MIN_BALANCE_TO_INVOKE_TX_ON_CHANGE',subkey_:currency0}}).then(async respoper=>{
    if(respoper && respoper['value_']){      let amtthresh=parseFloat(respoper['value_'])
      db.exchangerates.findOne({raw:true,where:{sitename:sitename,currency0:currency0,nettype:nettype}}).then(async respexrate=>{let collectoraddress,decimals
        if(respexrate && respexrate['collectoraddress']){collectoraddress=respexrate['collectoraddress']} else {console.log(`${HEADER_LOG_STOP_TX} collector undefined`);return false}
//        if(respexrate && respexrate['denominatorexp']  ){decimals=respexrate['denominatorexp']}           else {console.log(`${HEADER_LOG_STOP_TX} decimals undefined`);return false}
        const resptkn=await db.tokens.findOne({raw:true,where:{name:currency0,nettype:'mainnet'}})
        if (resptkn && resptkn['denominatorexp']){decimals=respexrate['denominatorexp']} else {console.log(`${HEADER_LOG_STOP_TX} decimals undefined`);return false}
        const respbal=await db.balance.findOne({raw:true,where:{username:username,sitename:sitename,nettype:nettype}}); let amtlocked
        if(respbal && respbal['amountlocked'] && parseFloat(respbal['amountlocked'])>=amtthresh ){amtlocked=parseFloat(respbal['amountlocked']) }
        else {console.log(`${HEADER_LOG_STOP_TX} balance<thresh?`,jdata);return false}
        sends({username:username,rxaddr:collectoraddress,amt2sendfloat:amtlocked,amt2sendwei:convethtowei(amtlocked,decimals),currency:currency0},'txsinternal')
      })
    } else {console.log(`${HEADER_LOG_STOP_TX} MIN_INVOKE_AMT undefined,34893`);return false
    }
  })
}
router.post('/exchange',async (req,res)=>{  // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  let {currency0, amount0}=req.body;console.log('exchange',req.body) // ,sitename
  if(currency0 && amount0 && sitename){} else {respreqinvalid(res,'ARG-MISSING',79654);return false};sitename=sitename.toUpperCase()
  amount0=parseFloat(amount0);  console.log(amount0)
  callhook({name:username,path:'exchange'})
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,sitename:sitename,active:1}}).then(resprates=>{
    if(resprates){} else {respreqinvalid(res,'DB-ENTRY-NOT-FOUND',81089);return false}
    db.balance.findOne({where:{currency:currency0,username:username,nettype:nettype,active:1}}).then(respbal=>{
      if(respbal){} else {respreqinvalid(res,'DB-BALANCE-NOT-FOUND',61677);return false}
      let respbaldata=respbal.dataValues
      const amount0wei=convethtowei(amount0,respbaldata['denominatorexp'])
      if(respbaldata['amount']-respbaldata['amountlocked']>=amount0wei){} else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',30212);return false}
      doexchange(username,req.body,respbal,resprates).then(resp=>{respok(res,null,38800,resp);        sendstoadminonexchange(req.body,username)
        return false
      }).catch(err=>{respreqinvalid(res,err.toString(),62015);return false})
    })
  })
}) //
router.get('/balance',async (req,res)=>{  // let username; try{username=await getuserorte rminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  const {currency}=req.query; console.log(req.query) // ,sitename
  if(username && currency && sitename){} else {respreqinvalid(res,'ARGMISSING',64472);return false}
  let _balance=utils.getbalance({username:username,currency:currency},'float')
  let _resprate = await db.exchangerates.findOne({raw:true,where:{currency0:currency,sitename:sitename,active:1}}) // .then(respate=>{let price
  let _forexrate= cliredisa.hget(KEYNAME_MARKETPRICES,KEYNAME_KRWUSD)
  Promise.all([_balance,_resprate,_forexrate]).then(async aresps=>{
    const [balance,resprate,forexrate]=aresps; let price=null
    if(resprate['priceisfixed']){      price={price:resprate['fixedprice'],units:resprate['units'],KRWUSD:forexrate}    } 
    else {
      let _priceredis=cliredisa.hget(KEYNAME_MARKETPRICES,currency)
      let _unitsredis=cliredisa.hget(KEYNAME_UNITS,currency)
      const aresps=await Promise.all([_priceredis,_unitsredis]) //.then(aresps=>{        
      const [priceredis,unitsredis]=aresps
      price={price:priceredis,units:unitsredis,KRWUSD:forexrate} //      })
    }
    respok(res,null,null,{amountstr:balance.toString(), price:price})
  }) //  })
})
router.get('/balances', async (req, res, next)=> {  // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  db.balance.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename,active:1}}).then(aresps=>{let a2send=[] ;console.log('balances',aresps.length)
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
    res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],convweitoeth(e['amount']-e['amountlocked'],e['denominatorexp']) ,e['address'],e['canwithdraw'] ]})})
//		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	})
//  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
});
router.get('/userpref',async (req,res)=>{ //let username; try{username=await getusero rterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  if(username){} else {respreqinvalid(res,'ARGMISSING',50892);return false}  
  let _user=db.users.findOne({raw:true,where:{username:username,sitename:sitename}})
  let _forexrate=cliredisa.hget(KEYNAME_MARKETPRICES,'KRWUSD')
  Promise.all([_user,_forexrate]).then(aresps=>{    let [user,forexrate]=aresps;    delete user['withdrawpw']
    respok(res,null,null,{ ... user, KRWUSD:forexrate});return false
  })
}) //
module.exports = router
const sends=(jdata,tabletouse)=>{  const {currency}=jdata
  switch(currency){
    case 'ETH':sendseth(jdata,tabletouse);break
    case 'BTC':sendsbtc(jdata,tabletouse);break
    default :sendstoken(jdata,tabletouse);break
  }
  return false
}
/*router.post('/exchangeXX',async (req,res)=>{  const {currency0, amount0}=req.body
  if(currency0 && amount0 ){} else {respreqinvalid(res,'ARG-MISSING',79655);return false} // && currency1 amount1 && && usernamecurrency1,,amount1,username
  db.excha ngerates.findOne({raw:true,where:{currency0:currency0,currency1:currency1}}).then(resprates=>{
    if(resprates){} else {respreqinvalid(res,'DB-ENTRY-NOT-FOUND',81089);return false}
    db.bal ance.find_One({where:{currency:currency0}}).then(respbal=>{
      if(respbal){} else {respreqinvalid(res,'DB-BALANCE-NOT-FOUND',61677);return false}
      if(respbal['amount']-respbal['amountlocked']>=parseInt(amount0)){} else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',33212);return false}
      doexc hange(username,req.body).then(resp=>{        respok(res,null,38800);return false
      }).catch(err=>{respreqinvalid(res,err.toString(),62016);return false})      
    })
  })
  res.status(200).send({status:'OK'});return false
})
*/
router.get('/balance_mixed',async (req,res)=>{  // let username; try{username=await getuseror terminate(req,res);if(username){} else {return false}} catch(err){return false} 
  let jdata; try{jdata=await getusero_rterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  const {currency}=req.query; console.log(req.query)
  if(username && currency){} else {respreqinvalid(res,'ARGMISSING',64472);return false}
  utils.getbalance({username:username,currency:currency},'float').then(async respbal=>{
    let _pricesstr= cliredisa.hget(KEYNAME_MARKETPRICES,'ALL')
    let _fixedpricesj=utils.getfixedtokenprices() // db.balanc e.findOne({raw:true,where:{... req.query}}).then(resp=>{    })
    Promise.all([_pricesstr,_fixedpricesj]).then(aresps=>{
      const [pricesstr,fixedpricesj]=aresps
      const jdata={... JSON.parse(pricesstr), ... fixedpricesj}
      respok(res,null,null,{amountstr:respbal.toString(), prices:JSON.stringify(jdata)})
    })
  })
if(false){	db.ba_lance.findOne({raw:true,where:{... req.query}}).then(async resp=>{    const prices=await cliredisa.hget(KEYNAME_MARKETPRICES,'ALL');		res.status(200).send({status:'OK',... resp,prices:prices});return false
	})}  //res.status(200).send({status:'OK',amount:100000,exchangerate:12,address:'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH'});return false
})