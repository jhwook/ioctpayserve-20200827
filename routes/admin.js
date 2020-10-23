
const express = require('express');
var router = express.Router();
const db=require('../models')
const utils = require('../utils');const moment=require('moment-timezone');const {convweitoeth}=utils
const redis=require('redis');const { respreqinvalid, respok,generateRandomStr,getip,delsession,hasher,validateethaddress,callhook,validaterate, validateprice} = require('../utils')
const configweb3= require('../configs/ETH/configweb3'); const {web3,nettype,netkind}=configweb3
const configbtc =require('../configs/BTC/configbtc'); const {bitcore:btc}=configbtc; const {createaccount}=require('../configs/utilscrypto')
const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient(); const _=require('lodash')
const messages=require('../configs/messages'); const SITENAME_DEF='IOTC'; const {validateurlsso}=require('../sso/sso')
const configs=require('../configs/configs'); const {queuenamesj,JTOKENSTODO_DEF,TIMEZONESTR}=configs;const MAX_URLADDRESS_LEN=100
const MSG_PLEASE_INPUT_SITENAME='사이트이름을 입력하세요'
const MSG_DATA_DUP='이미 등록된 이름입니다'
const MSG_SITENAME_INVALID='사이트이름이 유효하지 않습니다(3자 이상)',MSG_TOKENNAME_INVALID='토큰이름이 유효하지 않습니다(3자 이상)',MSG_ADDRESS_INVALID='토큰주소가 유효하지 않습니다',MSG_URL_INVALID='URL이 유효하지 않습니다'
const MSG_CONVRATE_INVALID='변환율이 유효하지 않습니다',MSG_FIXEDPRICE_INVALID='고정가격이 유효하지 않습니다',MSG_TOKEN_NOTREGISTERED='등록되지 않은 토큰입니다',MSG_SITETOKEN_NOTFOUND='등록되지 않은 사이트/토큰입니다'
const MSG_DELETED='삭제되었습니다',MSG_VALIDTOKEN_NOTFOUND='유효한 토큰이 발견되지 않습니다',MSG_REGISTER_DONE='등록되었습니다',MSG_DONE_STAKES='반영완료'
const MIN_SITENAME_LEN=3,MIN_TOKENNAME_LEN=3
const MIN_CSKCONVRATE=0,MAX_CSKCONVRATE=100; const MIN_FIXEDPRICE=0,MAX_FIXEDPRICE=10**8
const {getdecimals}=require('../configs/ETH/utilstoken') // ../periodic/ETH/tokens/utils') // ;const { id } = require('ethers/lib/utils');
const MAP_COINS_DECIMALS={BTC:8,ETH:18,USDT:6},DECIMALS_DEF=0
const B_ENABLE_QUE=true; const {enqueuedataj}=require('../reqqueue/enqueuer');
const { MSG_PLEASE_INPUT_DATA } = require('../configs/messages'); // const { token } = require('morgan')
const { route } = require('./users');
const { TIMESTRFORMAT , A_POINTSKINDS } = require('../configs/configs') // const {KEYNAME_MARKETPRICES,KEYNAME_UNITS, POINTSKINDS,A_POINTSKINDS, KEYNAME_KRWUSD,B_STA KES}=require('../configs/configs')
const MAP_CURRENCY_ADDRKIND={BTC:'ADDR-BTC',ETH:'ADDR-ETH'}
const getaddrtype4que=currency=>{  let addrkind=MAP_CURRENCY_ADDRKIND[currency]
  if(addrkind){} else {addrkind='ADDR-TOKEN'}
  return addrkind
}
router.get('/transactions',(req,res)=>{
  db.transactions.findAll({raw:true,}).then(aresps=>{    respok(res,null,null,{txs:aresps});return false
  }).catch(err=>{    respreqinvalid(res,'INTERNAL-ERR',62002);return false
  })
})
router.get('/balances/user', async (req,res,next)=> { // let username; try{username=await getuser orterminate(req,res);if(username){} else {return false}} catch(err){return false}
  let jdata // ; let username,sitename
//  try{jdata=await getuserorterminate(req,res) ; console.log(jdata) // getuserorgoon(req)// getuserorterminate(req,res)
  //  if(jdata){                            username=jdata['username'],   sitename=jdata['sitename']}
//    else if(await validateadminkey(req)){ username=req.query.username,  sitename=req.query.sitename}
    // else {	respreqinvalid(res,null,15389);return false}
//  } catch(err){return false} // if(username){} else {respreqinvalid(res,'필수정보를입력하세요',79258);return false}
  const {username,sitename}=req.query
  db.balance.findAll({raw:true,where:{username:username,nettype:nettype,sitename:sitename,active:1}}).then(aresps=>{let a2send=[] ;console.log('balances',aresps.length)
    aresps=aresps.filter(e=>{return ! A_POINTSKINDS.includes(e['currency'])})
    res.status(200).send({status:'OK',balances:aresps.map(e=>{return [
      e['currency']
      , convweitoeth(e['amount']-e['amountlocked'],e['denominatorexp'])
      ,e['address']
      ,e['canwithdraw']
      ,e['stakesamount']
      ,e['stakesstartdate']
      ,e['stakesexpiry']
      ,e['stakesduration']
      ,e['stakesactive']
    ]})}) //		res.status(200).send({status:'OK',balances:aresps.map(e=>{return [e['currency'],e['amountfloat'],e['address'] ]})})
	}) //  res.status(200).send({status:'OK'    , balances:[      ['BTC',100000000,'1FfmbHfnpaZjKFvyi1okTjJJusN455paPH']    , ['ETH',100000,'0x42A82b18758F3637B1e0037f0E524E61F7DD1b79']  ]  })
})

router.get('/balances',(req,res)=>{ const {sitename}=req.query
  if(sitename){
    db.balance.findAll({raw:true,where:{sitename:sitename,active:1}}).then(aresps=>{      respok(res,null,null,{balances:aresps});return false
    })
  } else {
    db.balance.findAll({raw:true,where:{active:1}}).then(aresps=>{      respok(res,null,null,{balances:aresps});return false
    })
  }
}) //
router.post('/sitenameholder/delete',async(req,res)=>{const {sitename}=req.body;console.log(req.body)
  await db.sitenameholder.destroy({where:{sitename:sitename,nettype:nettype}}) // update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.users.destroy({where:{sitename:sitename}}) // update({active:0},{where:{sitename:sitename}})
  await db.balance.destroy({where:{sitename:sitename,nettype:nettype}}) // update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.exchangerates.destroy({where:{sitename:sitename,nettype:nettype}}) // update({active:0},{where:{sitename:sitename,nettype:nettype}})
  db.balance.findAll({raw:true,where:{sitename:sitename}}).then(aresps=>{
    aresps.forEach(respbal=>{
			db.blockbalance.findOne({where:{address:respbal.address}} ).then(respblock=>{        if(respblock){respblock.destroy()} // update({active:0})}
			})
      let addrkind=getaddrtype4que(respbal.currency)
      if(B_ENABLE_QUE){enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })}
    })
  })
  respok(res,MSG_DELETED,19774);return false
}) //
router.post('/sitenameholder/delete/via/update',async(req,res)=>{const {sitename}=req.body;console.log(req.body)
  await db.sitenameholder.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.users.update({active:0},{where:{sitename:sitename}})
  await db.balance.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.exchangerates.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  db.balance.findAll({raw:true,where:{sitename:sitename}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}} ).then(respblock=>{        if(respblock){respblock.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency)
      if(B_ENABLE_QUE){enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })}
    })
  })
  respok(res,MSG_DELETED,19774);return false
}) // const MINSITENAMELEN=3 // 4
const EXCHGDATA_DEF=	{nettype:'mainnet',priceisfixed:0,canwithdraw:1,units:'KRW',valid:1,C:50,S:50,K:10}
const	EXCHGDATA_DEF02={nettype:'mainnet',priceisfixed:0,canwithdraw:1,units:'USD',valid:1,C:50,S:50,K:10}
router.post('/stakes',(req,res)=>{  let {username,active,currency,amount,startdate,duration,sitename}=req.body;amount=+amount ;duration=+duration;active=+active
  if(Number.isFinite(active) && username && currency&& Number.isFinite(amount) && startdate && Number.isFinite(duration) && sitename){}  else {respreqinvalid(res,'ARG-MISSING',23392);return false}
  if(active==1 || active==0){}    else {respreqinvalid(res,'ARG-INVALID',16516);return false}
  if(amount>0){}    else {respreqinvalid(res,'ARG-INVALID',16517);return false}
  if(duration>0){}  else {respreqinvalid(res,'ARG-INVALID',16518);return false}
  if(moment(startdate)){} else {respreqinvalid(res,'ARG-INVALID',16519);return false} // .tz('Asia/Seoul')
  db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
    if(respuser){} else {respreqinvalid(res,'USER-NOT-FOUND',56698);return false}
    db.balance.findOne({where:{username:username,sitename:sitename,currency:currency,nettype:nettype}}).then(respbal=>{
      if(respbal){} else {respreqinvalid(res,'ACCT-NOT-FOUND',33728);return false};      let respbaldata=respbal.dataValues
      respbal.update({ stakesactive:active, stakesamount:amount , stakesstartdate:startdate 
        , stakesexpiry:moment(startdate).add(duration,'days').format('YYYY-MM-DD') , stakesduration:duration}).then(resp=>{ // TIMESTRFORMAT
        respok(res,MSG_DONE_STAKES,66047);return false
      })
    })
  })
})
router.put('/sitenameholder',async(req,res)=>{let {sitename,urladdress}=req.body; if (sitename && sitename.length>=MIN_SITENAME_LEN){} else {respreqinvalid(res,MSG_PLEASE_INPUT_SITENAME,14574);return false};  console.log(req.body)
	sitename=sitename.toUpperCase()
	db.sitenameholder.findOne({where:{sitename:sitename}}).then(async resp=>{
		if(resp){} else {respreqinvalid(MSG_PLEASE_INPUT_SITENAME,47818	);return false}
		if(urladdress){} else {db.sitenameholder.update({urladdress:null},{where:{sitename:sitename}}); respok(res,null,80573	);return false }
		if(await validateurlsso(sitename,urladdress)){db.sitenameholder.update({urladdress:urladdress},{where:{sitename:sitename}});respok(res,`URL주소가 ${MSG_REGISTER_DONE}`,70108);return false}
		else {respreqinvalid(res,MSG_URL_INVALID,16867);return false}
	})
})
router.post('/sitenameholder',async(req,res)=>{let {sitename,urladdress}=req.body; if (sitename && sitename.length>=MIN_SITENAME_LEN){} else {respreqinvalid(res,MSG_PLEASE_INPUT_SITENAME,14575);return false};  console.log(req.body)
  sitename=sitename.toUpperCase();callhook({verb:'post',user:'admin',path:'sitenameholder'}); let burlvalid=0,jdata={}
  db.sitenameholder.findOne({where:{sitename:sitename}}).then(async resp=>{
    if(urladdress){
      if(await validateurlsso(sitename,urladdress)){burlvalid=1;jdata['urladdress']=urladdress}// urladdress=urladdress.substr(0,MAX_URLADDRESS_LEN)
      else {urladdress=null }
    }
    if(resp){
      if(resp.dataValues['active']) {respreqinvalid(res,MSG_DATA_DUP,43550);return false}
      else if(Object.keys(jdata).length>0){resp.update({... jdata, active:1});respok(res);return false}
      else {resp.update({ active:1});respok(res);return false}
    } //
    jdata['sitename']=sitename
    db.sitenameholder.create({... jdata,nettype:nettype}).then(resp=>{ }) // sitename:sitename,urladdress:urladdress
		Object.keys(JTOKENSTODO_DEF).forEach(tknname=>{
			switch (tknname){
				case 'BTC': db.exchangerates.create({currency0:tknname,sitename:sitename, ... EXCHGDATA_DEF});break
				case 'ETH': db.exchangerates.create({currency0:tknname,sitename:sitename, ... EXCHGDATA_DEF});break
				case 'USDT':db.exchangerates.create({currency0:tknname,sitename:sitename, ... EXCHGDATA_DEF02});break
			}
		})
		respok(res);return false
  })
})
router.get('/sitenameholder',(req,res)=>{callhook({verb:'get',user:'admin',path:'sitenameholder'})
  db.sitenameholder.findAll({raw:true,where:{active:1}}).then(resp=>{    res.status(200).send({status:'OK',sitenameholders:resp});return false
  })
})
router.post('/sitetoken/delete',async(req,res)=>{let {sitename,tokenname}=req.body;console.log(req.body)
  if(sitename && tokenname){} else {respreqinvalid(res,MSG_PLEASE_INPUT_DATA,79806);return false}
  await db.balance.update({active:0},{where:{sitename:sitename,currency:tokenname,nettype:nettype}})
  await db.balance.findAll({where:{sitename:sitename,currency:tokenname,nettype:nettype}}).then(aresps=>{
    aresps.forEach(respbalraw=>{const respbal=respbalraw.dataValues
      db.blockbalance.findOne({where:{address:respbal.address}}).then(respblock=>{if(respbalraw){respbalraw.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency) 
      if(B_ENABLE_QUE){enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })}
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
router.put('/sitetoken',(req,res)=>{console.log(req.body)
	let {sitename,tokenname,collectoraddress,Crate,Srate,Krate,fixedprice,canwithdraw}=req.body; let canwithdrawp
	if(sitename && tokenname){} else {respreqinvalid(res,MSG_PLEASE_INPUT_DATA,15104);return false};	let jdata={}
	if(validateethaddress(collectoraddress)){jdata['collectoraddress']=collectoraddress}
	if(validaterate(Crate)){jdata['C']=parseInt(Crate)}
	if(validaterate(Srate)){jdata['S']=parseInt(Srate)}
	if(validaterate(Krate)){jdata['K']=parseInt(Krate)}
	if(validateprice(fixedprice)){jdata['fixedprice']=parseInt(fixedprice)}
  if(Number.isInteger(parseInt(canwithdraw))){canwithdrawp=parseInt(canwithdraw);jdata['canwithdraw']=canwithdrawp
    db.balance.update({canwithdraw:canwithdrawp},{where:{sitename:sitename,currency:tokenname,nettype:nettype}}) // tokenname
  }
  db.exchangerates.update({... jdata},{where:{sitename:sitename,currency0:tokenname}}) // db.balance.findAll({where:{sitename:sitename,tokenname:tokenname,nettype:nettype}}).then(resp=>{     })
	respok(res);return false
})
router.post('/sitetoken',async(req,res)=>{  let {sitename,tokenname,contractaddress,Crate,Srate,Krate,collectoraddress,fixedprice,isvariableprice,canwithdraw}=req.body; let jdata={}; console.log(req.body)
  callhook({verb:'post',user:'admin',path:'sitetoken'})
  sitename=sitename.toUpperCase(),tokenname=tokenname.toUpperCase()
  if(sitename && sitename.length>=MIN_SITENAME_LEN){jdata['sitename']=sitename}     else {respreqinvalid(res,MSG_SITENAME_INVALID);return false}
  if(tokenname && tokenname.length>=MIN_TOKENNAME_LEN){jdata['currency0']=tokenname}  else {respreqinvalid(res,MSG_TOKENNAME_INVALID);return false}
  let decimals
  if(MAP_COINS_DECIMALS[tokenname]){decimals=MAP_COINS_DECIMALS[tokenname];jdata['address']=null;jdata['denominatorexp']=decimals}
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
	else {decimals=DECIMALS_DEF}
  let jconvrates={C:Crate,S:Srate,K:Krate} // [C,S,K]
  Object.keys(jconvrates).forEach(key=>{const val=jconvrates[key]; if(val){} else {return false}; let rate=val
    if(rate){rate=parseInt(rate);if(rate>=MIN_CSKCONVRATE && rate<=MAX_CSKCONVRATE){jdata[key]=val} else {respreqinvalid(res,MSG_CONVRATE_INVALID,40154);return false}}
  })
  fixedprice=parseFloat(fixedprice)
  if(fixedprice){    if( fixedprice>=MIN_FIXEDPRICE && fixedprice<=MAX_FIXEDPRICE){ jdata['fixedprice']=fixedprice}    else {respreqinvalid(res,MSG_FIXEDPRICE_INVALID);return false}
  }
  else {respreqinvalid(res,`${MSG_PLEASE_INPUT_DATA} (고정값)`);return false}
  isvariableprice=parseInt(isvariableprice);canwithdraw=parseInt(canwithdraw)
  if(false){jdata['priceisfixed']=1-isvariableprice}
	if(true ){jdata['priceisfixed']=1}
	jdata['units']='KRW'
  if(Number.isInteger(canwithdraw)){jdata['canwithdraw']=canwithdraw};jdata['nettype']=nettype
  if(collectoraddress ){    if(validateethaddress(collectoraddress)){jdata['collectoraddress']=collectoraddress}    else {}  }
  try{
    let resprate=await db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname,nettype:nettype}}) // .then(resp=>{
    if(resprate){resprate.update({active:1, ... jdata})} // ;respok(res,'Updated')
    else { resprate=await     db.exchangerates.create(    {... jdata}  )} // .then(resp=>{;})    } // })
    const canwithdraw=resprate.dataValues['canwithdraw']
    db.tokens.findOne({where:{name:tokenname,nettype:nettype}}).then(resp=>{     const jdtkn={      name:tokenname      , denominatorexp:decimals      , sitename:sitename
        , netkind:netkind      , nettype:nettype      , address:contractaddress      , canwithdraw:canwithdraw
      }
      if(resp){resp.update({active:1,... jdtkn} );return false} 
      else {try{db.tokens.create(jdtkn); db.operations.create({key_:'MIN_BALANCE_TO_INVOKE_TX_ON_CHANGE',subkey_:tokenname,value_:1000})} catch(err){console.log(err)}
      }    // raw:true,
    })
    db.sitenameholder.findOne({where:{sitename:sitename,nettype:nettype}}).then(resp=>{    const jdsite={        sitename:sitename, nettype:nettype      }
      if(resp){resp.update({active:1,... jdsite});return false} 
      else {      db.sitenameholder.create(jdsite)    }
    }) //  db.sitenameholder.des troy()
    db.users.findAll({raw:true,where:{sitename:sitename}}).then(async arespsusers=>{
      if(arespsusers){} else {return false}
      arespsusers.forEach(async user=>{const username=user['username']
        let respbal=await db.balance.findOne({where:{sitename:sitename,username:username,currency:tokenname}})
        let acct,address
				if(respbal){respbal.update({active:1}) //					if(MAP_COINS_DECIMALS[tokenname]){}					else {respbal.update({active:1,blocknumberrx:1})}
				}
        else {
          let jdbalcmn={ username:username ,currency:tokenname ,netkind:netkind ,nettype:nettype ,sitename:sitename , amount:0 , amountfloat:0,amountstr:0
          ,canwithdraw:canwithdraw}
          if(contractaddress){
            db.balance.findOne({raw:true,where:{username:username,sitename:sitename,nettype:nettype,currency:'ETH'}}).then(async respbaleth=>{
              if(respbaleth){address=respbaleth['address']
                await db.balance.create({... jdbalcmn ,denominatorexp:decimals ,address:address ,privatekey:respbaleth['privatekey'] ,group_:'ETH',active:1
                })
              } else {acct=createaccount('ETH');address=acct['address']
                db.balance.create({... jdbalcmn,denominatorexp:MAP_COINS_DECIMALS['ETH'],address:acct['address'],privatekey:acct['privatekey'],_group:'ETH',active:1})
                db.balance.create({... jdbalcmn,denominatorexp:decimals,address:acct['address'],privatekey:acct['privatekey'],_group:'ETH',active:1})
              }
            })
          } else {
            if(MAP_COINS_DECIMALS[tokenname]){              acct=createaccount(tokenname);address=acct['address']
              await db.balance.create({... jdbalcmn ,denominatorexp:MAP_COINS_DECIMALS[tokenname] ,address:acct['address'] ,privatekey:acct['privatekey'] ,_group:tokenname,active:1
              })
            }
          }
        }
        if(B_ENABLE_QUE){enqueuedataj(queuenamesj[getaddrtype4que(tokenname)], {flag:'ADD', username:username,address:address })}
      })
    })
    respok(res,MSG_REGISTER_DONE);return false
  } catch(err){
    respreqinvalid(res,null,12888) // raw:true,
  }
})
router.get('/ping',(req,res)=>{	res.status(200).send({status:'OK',message:'ping'});return false
})
router.get('/stats',(req,res)=>{let aproms=[];const attls=['users','balance','blockbalance','tokens','exchangerates']
	aproms.push( db.users.count({}))
	aproms.push( db.balance.count({}))
	aproms.push( db.blockbalance.count({}))
	aproms.push( db.tokens.count({}))
	aproms.push(db.exchangerates.count({}))
	Promise.all(aproms).then(aresps=>{		let jdata={titles:attls,values:aresps} ;console.log(aresps) //		let jdata=_.zipObject([ [... attls],[... aresps]]);console.log(jdata)		
		respok(res,null,null,jdata );return false
	})
})
module.exports = router

router.delete('/sitetoken',async(req,res)=>{let {sitename,tokenname}=req.body;console.log(req.body)
  if(sitename && tokenname){} else {respreqinvalid(res,MSG_PLEASE_INPUT_DATA,79806);return false}
  await db.balance.update({active:0},{where:{sitename:sitename,currency:tokenname,nettype:nettype}})
  await db.balance.findAll({raw:true,where:{sitename:sitename,currency:tokenname,nettype:nettype}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}}).then(respblock=>{if(respbal){respbal.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency) 
      if(B_ENABLE_QUE){enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })}
    })
  })
  db.exchangerates.findOne({where:{sitename:sitename,currency0:tokenname,nettype:nettype}}).then(resp=>{
    if(resp){} else {respreqinvalid(res,MSG_SITETOKEN_NOTFOUND);return false}
    resp.update({active:0})    // resp.des troy()
    respok(res,MSG_DELETED,29532);return false
  })
})
router.delete('/sitenameholder',async(req,res)=>{const {sitename}=req.body;console.log(req.body)
  await db.sitenameholder.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.users.update({active:0},{where:{sitename:sitename}})
  await db.balance.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  await db.exchangerates.update({active:0},{where:{sitename:sitename,nettype:nettype}})
  db.balance.findAll({raw:true,where:{sitename:sitename}}).then(aresps=>{
    aresps.forEach(respbal=>{
      db.blockbalance.findOne({where:{address:respbal.address}} ).then(respblock=>{        if(respblock){respblock.update({active:0})}      })
      let addrkind=getaddrtype4que(respbal.currency)
      if(B_ENABLE_QUE){enqueuedataj(queuenamesj[addrkind], {flag:'DELETE', username:respbal.username,address:respbal.address })}
    })
  })
  respok(res,MSG_DELETED,19774);return false
//  .then(resp=>{    respok(res,MSG_DELETED,19774);return false  }) //  db.sitenameholder.des troy({where:{sitename:sitename}}).then(resp=>{    respok(res,MSG_DELETED,19774);return false  })
}) //
