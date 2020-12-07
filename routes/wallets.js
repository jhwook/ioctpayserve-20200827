var express = require('express');
var router = express.Router();const moment=require('moment-timezone')
const {KEYNAME_MARKETPRICES,KEYNAME_UNITS, POINTSKINDS,A_POINTSKINDS, KEYNAME_KRWUSD,B_STAKES}=require('../configs/configs')
const messages=require('../configs/messages')
const {respreqinvalid,respwithdata, convethtowei, respok, doexchange, generateRandomStr,getip, delsession,getusernamefromsession, convweitoeth  ,callhook
,validatekey,getuserorgoon, getuserorterminate,validateadminkey, isequalinlowercases , bigintdiv, isethbalanceenough4fee
}=require('../utils')
const db=require('../models');const dbmon=require('../modelsmon')
const {sends:sendsbtc}=require('../periodic/BTC/sends')
const {sendseth}=require('../periodic/ETH/sendseth')
const {sendstoken}=require('../periodic/ETH/sendstoken') // const {se nds eth,sendstoken}=require('../periodic/ETH/s ends')
const utils = require('../utils') // ;const B_STAKES=1
const { netkind,nettype } = require('../configs/ETH/configweb3');const {verifypw}=require('../sso/sso')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient();const LOGGER=console.log
const convstakeamount2wei=(str,denominatorexp)=>convethtowei(+str, denominatorexp) // convweitoeth
/* GET users listing. */
const MSGS={MSG_PW_INVALID:'출금암호가 맞지 않습니다'}
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
router.post('/withdraw',async(req,res)=>{  // let username; try{username=await getusero rterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename,hashcode}=jdata ; LOGGER('V6RiXI8Que',jdata)
  const {amount,address,pw,currency}=req.body; console.log(req.body)
  if(amount && address && pw && username && currency){} else {respreqinvalid(res,messages.MSG_PLEASE_INPUT_DATA,67648);return false}
  try {await verifypw({sitename:sitename , hashcode:hashcode , pw:pw})}
  catch(err){console.log(err);respreqinvalid(res,MSGS.MSG_PW_INVALID,19825);return false}
  db.users.findOne({raw:true,where:{username:username,withdrawpw:pw,sitename:sitename}}).then(async resp=>{
    if(resp){} else {respreqinvalid(res,messages.MSG_ID_OR_PW_INVALID,59497);return false}  //
//    respok(res);return false
    const tokendata=await db.tokens.findOne({raw:true,where:{name:currency,nettype:nettype}});
    if(tokendata){} else {return false} const decimals=tokendata['denominatorexp']
    sends({username:username
      ,rxaddr:address
      ,amt2sendfloat:+amount
      ,amt2sendwei:convethtowei(amount,decimals)
      ,currency:currency
      ,sitename:sitename , amt2sendstr:''+amount  },'transactions')
    //    se nds({username:username,rxaddr:address,amt2sendfloat:pa rseFloat(amount),amt2sendwei:convethtowei(amount,decimals),currency:currency,sitename:sitename},'transactions')
//    sendsethkinds({username:username,rxaddr:address,amt2sendfloat:amount,amt2sendwei:convethtowei(amount)})
    res.status(200).send({status:'OK'});
    callhook({name:username,path:'withdraw'});    return false
  }).catch(err=>{console.log(err); respreqinvalid(res,err.toString(),54726);return false})
}) //
const HEADER_LOG_STOP_TX='stop admin tx:';const B_VERB=0
const sendstoadminonexchange=async (jdata,username)=>{let {currency0,sitename}=jdata // ; amount0=par seFloat(amount0)
  db.operations.findOne({raw:true,where:{key_:'MIN_BALANCE_TO_INVOKE_TX_ON_CHANGE',subkey_:currency0}}).then(async respoper=>{if(B_VERB){console.log('respoper',respoper)}
    if(respoper && respoper['value_']){      let amtthresh=+respoper['value_']; if(B_VERB){console.log('amtthresh',amtthresh)}
      db.exchangerates.findOne({raw:true,where:{sitename:sitename,currency0:currency0,nettype:nettype}}).then(async respexrate=>{let collectoraddress,decimals;if(B_VERB){console.log('respexrate',respexrate)}
        if(respexrate && respexrate['collectoraddress']){collectoraddress=respexrate['collectoraddress']} else {console.log(`${HEADER_LOG_STOP_TX} collector undefined`);return false}
        if(B_VERB){console.log('collectoraddress',collectoraddress)} //        if(respexrate && respexrate['denominatorexp']  ){decimals=respexrate['denominatorexp']}           else {console.log(`${HEADER_LOG_STOP_TX} decimals undefined`);return false}
        const resptkn=await db.tokens.findOne({raw:true,where:{name:currency0,nettype:'mainnet'}})
        if (resptkn && resptkn['denominatorexp']){decimals=resptkn['denominatorexp']} else {console.log(`${HEADER_LOG_STOP_TX} decimals undefined`);return false}; if(B_VERB){console.log('resptkn',resptkn)}
        const respbal=await db.balance.findOne({raw:true,where:{username:username,sitename:sitename,currency:currency0, nettype:nettype}}); let amtlocked; if(B_VERB){console.log('respbal',respbal)}
        if(isequalinlowercases(respbal['address'] , collectoraddress) ) {console.log(`${HEADER_LOG_STOP_TX} same address`); return false}
        if(1 || B_VERB){console.log('7zKdtgAxFz',respbal['amountlocked'],amtthresh)}
//        if(respbal && Number.isFinite(respbal['amountlocked']) && par seFloat(respbal['amountlocked'])>=amtthresh ){amtlocked=parseFl oat(respbal['amountlocked']) }
        if(respbal && Number.isFinite(respbal['amountlocked']) && +respbal['amountlocked']>=amtthresh ){amtlocked=+ respbal['amountlocked'] }
        else {console.log(`${HEADER_LOG_STOP_TX} balance<thresh?`,jdata);return false}
        sends({username:username
          ,rxaddr:collectoraddress
          ,amt2sendfloat:convweitoeth(amtlocked)
          ,amt2sendwei:amtlocked , amt2sendstr:''+jdata.amount0
          ,currency:currency0
          ,sitename:sitename},'txsinternal','collector') // convethtowei(amtlocked,decimals)
      })
    } else {console.log(`${HEADER_LOG_STOP_TX} MIN_INVOKE_AMT undefined,34893`);return false
    }
  })
}
router.post('/exchange',async (req,res)=>{console.log('exchange',req.body)  // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata; req.body.sitename=sitename;req.body.username=username
  let {currency0, amount0, jconvdamounts}=req.body;console.log('exchange',req.body) // ,sitename
  if(currency0 && amount0 && sitename){} else {respreqinvalid(res,'ARG-MISSING',79654);return false};sitename=sitename.toUpperCase()
  amount0=+ amount0;  console.log(amount0) // parseFloat
  callhook({name:username,path:'exchange'})
  db.exchangerates.findOne({raw:true,where:{currency0:currency0,sitename:sitename,active:1}}).then(async resprates=>{
    if(resprates){} else {respreqinvalid(res,'DB-ENTRY-NOT-FOUND',81089);return false}
    db.balance.findOne({where:{currency:currency0,sitename:sitename, username:username,nettype:nettype,active:1}}).then(async respbal=>{
      if(respbal){} else {respreqinvalid(res,'DB-BALANCE-NOT-FOUND',61677);return false}
      let respbaldata=respbal.dataValues
      const amount0wei=convethtowei(amount0,respbaldata['denominatorexp'])
      if(B_STAKES && respbaldata['stakesactive']){
        if(respbaldata['amount']-respbaldata['amountlocked']- convstakeamount2wei(respbaldata['stakesamount'] , respbaldata['denominatorexp']) >=amount0wei){      }
        else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',30211);return false}
      }
      else {
        if(respbaldata['amount']-respbaldata['amountlocked']>=amount0wei){}             
        else {respreqinvalid(res,'BALANCE-NOT-ENOUGH',30212);return false}
      }
      let ethenough=await isethbalanceenough4fee(jdata)
      if(ethenough){} else {respreqinvalid(res,'ETH-BALANCE-NOT-ENOUGH',31103);return false}
      req.body.hashcode=req.headers.hashcode
      doexchange(username,req.body,respbal,resprates , jconvdamounts).then(resp=>{respok(res,null,38800,resp )
      sendstoadminonexchange(req.body,username);        return false
      }).catch(err=>{respreqinvalid(res,err.toString(),62015);return false})
    })
  })
}) //
router.get('/balance',async (req,res)=>{  // let username; try{username=await getuserorte rminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; try{jdata=await getuserorterminate(req,res);if(jdata){} else {return false}} catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  let {username,sitename}=jdata
  const {currency}=req.query; console.log(req.query) // ,sitename
  if(username && currency && sitename){} else {respreqinvalid(res,'ARGMISSING',64472);return false}
  let _balance=utils.getbalanceandstakes({username:username,currency:currency,sitename:sitename},'float')
  let _resprate = await db.exchangerates.findOne({raw:true,where:{currency0:currency,sitename:sitename,active:1}}) // .then(respate=>{let price
  let _forexrate= cliredisa.hget(KEYNAME_MARKETPRICES,KEYNAME_KRWUSD)
  Promise.all([_balance,_resprate,_forexrate]).then(async aresps=>{
    const [balance,resprate,forexrate]=aresps; let price=null
    if(resprate['priceisfixed']){      price={price:resprate['fixedprice'],units:resprate['units'],KRWUSD:forexrate} }
    else {
      let _priceredis=cliredisa.hget(KEYNAME_MARKETPRICES,currency)
      let _unitsredis=cliredisa.hget(KEYNAME_UNITS,currency)
      const aresps=await Promise.all([_priceredis,_unitsredis]) //.then(aresps=>{
      const [priceredis,unitsredis]=aresps
      price={price:priceredis,units:unitsredis,KRWUSD:forexrate} // })
    }
    respok(res,null,null,{amountstr:balance['amount'].toString(),denominatorexp:balance['denominatorexp'], price:price, stakes:{amount:balance['stakesamount'],expiry:balance['stakesexpiry'],active:balance['stakesactive']
  }})
  }) //  })
})
router.get('/balances', async (req,res,next)=> { // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata; let username,sitename  
  try{jdata=await getuserorterminate(req,res) ; console.log(jdata) // getuserorgoon(req)// getuserorterminate(req,res)
    if(jdata){                            username=jdata['username'],   sitename=jdata['sitename']}
//    else if(await validateadminkey(req)){ username=req.query.username,  sitename=req.query.sitename}
    else {	respreqinvalid(res,null,15389);return false}
  } catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  db.balance.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename,active:1}}).then(aresps=>{let a2send=[] ;console.log('balances',aresps.length)
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
    res.status(200).send({status:'OK',balances:aresps.map(e=>{
      let amteff=BigInt(e['amount']) - BigInt(e['amountlocked'])
      let amtfullstr ;try{ amtfullstr= (amteff ).toString()} catch(err){amtfullstr=null}  
      return [
      e['currency']
      ,bigintdiv(Number(amteff) , 10**e['denominatorexp'] , 4  ) //   convweitoeth(e['amount']-e['amountlocked'],)
//      ,bigintdiv(amteff , BigInt(10**e['denominatorexp']) , 4  ) //   convweitoeth(e['amount']-e['amountlocked'],)
      ,e['address']
      ,e['canwithdraw']
      ,e['stakesamount']
      ,e['stakesstartdate']
      ,e['stakesexpiry']
      ,e['stakesduration']
      ,e['stakesactive']
      , amtfullstr
    ]})}) //		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	}) //  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
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
router.get('/image',(req,res)=>{console.log(req.query);  const {name}=req.query
  if(name){} else {respreqinvalid(res,'ARG-MISSING',69460);return false}
  dbmon.images.findOne({name:name} , function(err,resp){if(err){respreqinvalid(res,'INTERNAL-ERR',35994);return false}
    if(resp){respok(res,null,null,resp._doc);return false}
    else {respreqinvalid(res,'NOT-FOUND',35995);return false}
  })
})
module.exports = router
// se nds({username:username,rxaddr:collectoraddress,amt2sendfloat:amtlocked,amt2sendwei:amtlocked,currency:currency0,sitename:sitename},'txsinternal','collector') // convethtowei(amtlocked,decimals)
const sends=(jdata,tabletouse,modecollectorgeneral)=>{  const {username,currency,sitename,amt2sendwei}=jdata; console.log('jdata@sends',jdata)
  db.balance.findOne({raw:true,where:{currency:currency, sitename:sitename,username:username,nettype:nettype,active:1}}).then(respbaldata=>{
    if(modecollectorgeneral && modecollectorgeneral=='collector'){
      if(respbaldata['amountlocked']>=amt2sendwei){}
      else {console.log('BALANCE-NOT-ENOUGH',jdata,30212);return false} // res,
    }
    else {
      if(B_STAKES && respbaldata['stakesactive']){
        if(respbaldata['amount']-respbaldata['amountlocked']-convstakeamount2wei(respbaldata['stakesamount'],respbaldata['denominatorexp']) >=amt2sendwei){ } 
        else {  console.log('BALANCE-NOT-ENOUGH',jdata,30213);return false}
      }
      else {
        if(respbaldata['amount']-respbaldata['amountlocked']>=amt2sendwei){}
        else {console.log('BALANCE-NOT-ENOUGH',jdata,30214);return false} // res,
      }
    }; console.log('callsend')
    switch(currency){
      case 'ETH':sendseth(jdata,tabletouse,modecollectorgeneral);break
      case 'BTC':sendsbtc(jdata,tabletouse,modecollectorgeneral);break
      default :sendstoken(jdata,tabletouse,modecollectorgeneral);break
    }
    return false    
  })
}
//     se nds({username:username,rxaddr:address,amt2sendfloat:par seFloat(amount),amt2sendwei:convethtowei(amount,decimals),currency:currency,sitename:sitename},'transactions')
/*router.post('/exc hangeXX',async (req,res)=>{  const {currency0, amount0}=req.body
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
  utils.getbal_ance({username:username,currency:currency},'float').then(async respbal=>{
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
require('node-cron').schedule('1 0 0 * * *',_=>{
  db.balance.findAll({raw:true,where:{stakesactive:1}}).then(aresps=>{
    aresps.some(e=>{      const expiry=e['stakesexpiry']
      if(expiry){} else {return false}
      if(moment().format('YYYY-MM-DD')>=expiry){
        db.balance.update({stakesactive:0},{where:{id:e['id']}}).then(resp=>{console.log(`deactive stakes ${JSON.stringify(e,null,0)}`) })
      }
    })
  })
})
