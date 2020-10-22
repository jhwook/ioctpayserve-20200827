const db=require('./models');const axios=require('axios')
const moment=require('moment');const {netkind,nettype}=require('./configs/ETH/configweb3')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const md5 = require('md5');const  sha1 = require('sha1')
const {validatekey,validatekeyorterminate}=require('./sso/sso')
const {KEYNAME_MARKETPRICES,POINTSKINDS,KEYNAME_KRWUSD, TIMESTRFORMAT}=require('./configs/configs')
const messages=require('./configs/messages')
const MAP_KRWUSD_APPLIES={BTC:1,ETH:1,USDT:1}
const gettimestr=()=>{return moment().format('YYYY-MM-DD HH:mm:ss.SSS')}
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}, resperr=respreqinvalid
const respwithdata=(res,data)=>{res.status(200).send({status:'OK',... data});return false}
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
const getpricesstr=async ()=>{return await cliredisa.hget(KEYNAME_MARKETPRICES,'ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat,decimals)=>{const exp=decimals?decimals:18; return parseInt(parseFloat(numfloat)*10**exp) }
const convweitoeth=(numint,decimals)=>  {const exp=decimals?decimals:18; return parseInt(numint)/10**exp}
const convtohex=(intdec)=>{return `0x${intdec.toString(16)}`}
const isequalinlowercases=(str0,str1)=>{return str0.toLowerCase()==str1.toLowerCase()}
const MIN_ETH_ADDRESS_LEN=40; const MIN_RATE=0,MAX_RATE=200,DENOMINATOREXP_POINTS=0
const validaterate=val=>{val=parseInt(val);if(Number.isInteger(val) && val>=MIN_RATE && val<=MAX_RATE){return true} else {return false}}
const MIN_PRICE=0,MAX_PRICE=10**8
const validateprice=val=>{val=parseInt(val);if(Number.isInteger(val) && val>MIN_PRICE && val<=MAX_PRICE){return true} else {return false} }
const validateethaddress=str=>{return str && parseInt(str,16) && str.length>=MIN_ETH_ADDRESS_LEN}
const validateadminkey=async req=>{const {adminkey}=req.headers; if(adminkey){} else {return null}
  const resp=await db.operations.findOne({raw:true,where:{key_:'ADMINKEY',value_:adminkey}})
  return resp
}
const delsession=(req)=>{const token=req.headers.token
  db.sessionkeys.findOne({where:{token:token}}).then(resp=>{
    if(resp){resp.update({active:0})} else {return false}
  })
}
const getuserorgoon=async req=>{let jdata,username=null 
  try {jdata=await validatekeyorterminate(req,res)
    if(jdata){return jdata}
    else {      jdata=await getusernamefromsession(req); if(jdata){return jdata} else {return null} }
  }
  catch(err){   jdata=await getusernamefromsession(req); if(jdata){return jdata} else {return null}
  }
}
const getuserorterminate=async (req,res)=>{  let jdata,username=null // ;req.headers.sitename=req.body.sitename; req.headers.hashcode=req.body.hashcode
  try {jdata=await validatekeyorterminate(req,res)
    if(jdata){return jdata}
    else {      jdata=await getusernamefromsession(req); if(jdata){return jdata} else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73200);return null} }
  }
  catch(err){   jdata=await getusernamefromsession(req); if(jdata){return jdata} else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73210);return null}
  }
} //
const getuseronlyorterminate=async (req,res)=>{  let username=null // ;req.headers.sitename=req.body.sitename; req.headers.hashcode=req.body.hashcode
  try {username=await validatekeyorterminate(req,res)
    if(username){return username}
    else {      username=await getusernamefromsession(req); if(username){return username} else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73220);return null} }
  }
  catch(err){   username=await getusernamefromsession(req); if(username){return username} else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73230);return null}
  }
} //
const getusernamefromsession=async req=>{ // console.log('headers',req.headers)
  if(req.headers.token){} else {return null}
  const session=await db.sessionkeys.findOne({raw:true,where:{token:req.headers.token,active:1}}) //;console.log('session',session)
  if(session){ return {username:session['username'],sitename:session['sitename']}} else {return null}
}
const getusernameonlyfromsession=async req=>{  // console.log('headers',req.headers)
  if(req.headers.token){} else {return null}
  const session=await db.sessionkeys.findOne({raw:true,where:{token:req.headers.token,active:1}}) //;console.log('session',session)
  if(session){ return session['username']} else {return null}
}
const incdecbalance_reflfee=(jdata,txdata,calldata)=>{let {username,currency,amountdelta}=jdata;console.log(jdata);let  blocknumber
  if(txdata){amountdelta+=txdata['gasUsed']*calldata['GAS_PRICE']
    blocknumber=txdata['blockNumber']
  } // txdata['gas']*txdata['gasPrice']}  
  db.balance.findOne({where:{username:username,currency:currency,nettype:nettype}}).then(resp=>{    const amt01=resp.dataValues.amount-parseInt(amountdelta)
    let jdata2upd={amount:amt01    , amountfloat:convweitoeth(amt01),blocknumbertx:blocknumber    }
    if(blocknumber>resp['blocknumbertx']){} else {delete jdata2upd['blocknumbertx']}
    resp.update(jdata2upd)
  }) //  db.balance.update({amount:db.sequelize.literal(`amount-${parseInt(amountdelta)}`)},{where:{username:username,currency:currency,nettype:nettype}})
} // incdecbalance({username:'',curency:'',amountdelta:''})
const incdecbalance=(jdata,resptx)=>{let {username,currency,amountdelta,nettype}=jdata;console.log(jdata) // ,txdata,calldata
  let _respbal=db.balance.findOne({where:{username:username,currency:currency,nettype:nettype}})
  let _resptkn=db.tokens.findOne( {raw:true,where:{name:currency,nettype:nettype }})
  const blocknumber=resptx['blockNumber']
  Promise.all([_respbal,_resptkn]).then(aresps=>{
    let [respbal,resptkn]=aresps; console.log('resptkn',resptkn)
    const amt01= respbal.dataValues.amount-parseInt(amountdelta)
    let jdata2upd={amount:amt01    , amountfloat:convweitoeth(amt01,resptkn['denominatorexp']),blocknumbertx:blocknumber    }
    if(blocknumber>respbal['blocknumbertx']){}     else {      delete jdata2upd['blocknumbertx']    }
    respbal.update(jdata2upd)
  })
} // incdecbalance({username:'',curency:'',amountdelta:''})
const getbalanceandstakes=(jdata,bfloatwei)=>{return new Promise((resolve,reject)=>{const {username,currency,sitename}=jdata
  db.balance.findOne({raw:true,where:{username:username,currency:currency,nettype:nettype,sitename:sitename }}).then(resp=>{
    if(resp){    let amtwei=resp['amount']-resp['amountlocked'];      amtwei= bfloatwei && bfloatwei=='float'? amtwei/10**resp['denominatorexp']: amtwei
      resolve({amount:amtwei, stakesamount:resp['stakesamount'],stakesexpiry:resp['stakesexpiry'],stakesactive:resp['stakesactive'] })
    } else {reject('NOT-FOUND')}
  }).catch(err=>{reject(err.toString())})
})} 
const getbalance=(jdata,bfloatwei)=>{return new Promise((resolve,reject)=>{const {username,currency,sitename}=jdata
  db.balance.findOne({raw:true,where:{username:username,currency:currency,nettype:nettype,sitename:sitename }}).then(resp=>{
    if(resp){    const amtwei=resp['amount']-resp['amountlocked']
      resolve(bfloatwei && bfloatwei=='float'? amtwei/10**resp['denominatorexp']: amtwei )
    } else {reject('NOT-FOUND')}
  }).catch(err=>{reject(err.toString())})
})}
const getRandomInt=(min,max)=>{
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
} //
function generateRandomStr (length) {
	var result           = '';	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {		 result += characters.charAt(Math.floor(Math.random() * charactersLength))	}
	return result;
}
const getip=(req)=>{	return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['x-real-ip']}
const doexchange=async (username,jdata,respbal,resprates)=>{
  return new Promise (async (resolve,reject)=>{let {currency0,amount0}=jdata; amount0=parseFloat(amount0);console.log('jdata',jdata);let sitename=jdata['sitename'].toUpperCase()
    let respbaldata=respbal.dataValues;let price=null
    const amount0wei=convethtowei(amount0,respbaldata['denominatorexp'] ) // const amount0wei=convethtowei(amount0)    
    if(resprates.priceisfixed && resprates.priceisfixed==1){price=resprates['fixedprice']}
    else {      price=await cliredisa.hget(KEYNAME_MARKETPRICES,currency0) }
    if(price){price=parseFloat(price)}
    else {
      let respvarprice=await db.variableprices.findOne({currency:currency0})
      if(respvarprice){} else {reject('DB-ENTRY-NOT-FOUND');return false}
      if(respvarprice['units']=='KRW'){}
      else {
        const exratekrwusd=await cliredisa.hget(KEYNAME_MARKETPRICES,KEYNAME_KRWUSD)
        price=respvarprice['price']*parseFloat(exratekrwusd)
      }
    } //    cliredisa.hget(KEYNAME_MARKETPRICES,currency0).then(price=>{  price=parseFloat(price)//      const respbaldata=respbal.dataValues
    if(MAP_KRWUSD_APPLIES[currency0]){ price *= parseFloat(await cliredisa.hget(KEYNAME_MARKETPRICES,KEYNAME_KRWUSD))
    }
    console.log('amount0wei',amount0wei,'price',price)
      const amtlockedtoupd=parseInt(respbaldata['amountlocked'])+parseInt(amount0wei)
      const amtbefore=respbaldata['amount']-respbaldata['amountlocked'],amountafter=amtbefore-parseInt(amount0wei)
      respbal.update({amountlocked:amtlockedtoupd})
      let extodata={}; 
      Object.keys(POINTSKINDS).forEach(pointkind=>{const amttoinc=parseInt(amount0 *price * resprates[pointkind]/100);console.log(amount0,price , resprates[pointkind],amttoinc)
        extodata[pointkind]=amttoinc; let jdataq={username:username,currency:pointkind,netkind:netkind,sitename:sitename,denominatorexp:DENOMINATOREXP_POINTS}
        db.balance.findOne({where:{... jdataq }}).then(resp=>{
          if(resp){          const respdata=resp.dataValues          ;          resp.update({amount:respdata['amount']+amttoinc })          } 
          else {            db.balance.create({amount:amttoinc, nettype:nettype, ... jdataq })          }
        })
      })
      db.transactions.create({
        username:username
        , currency:currency0
        , fromamount:amount0wei
        , amountfloatstr:amount0 // convweitoeth(amount0wei , respbaldata['den'])
        , amountbefore:respbaldata['amount']
        , amountafter:respbaldata['amount']-amount0wei
        , kind:'EXCHANGE'
        , netkind:netkind
        , nettype:nettype
        , description:JSON.stringify(extodata)
        , txtime:moment().format(TIMESTRFORMAT)
        , sitename:jdata['sitename']
      })
//    }).catch(err=>{reject(err.toString())})
    resolve(jdata)
  })
}
const getfixedtokenprices=rettype=>{
  return new Promise ((resolve,reject)=>{let jdata={}
    db.fixedprices.findAll({raw:true}).then(aresps=>{
      aresps.forEach(tknd=>{        jdata[tknd['tokenname']]=tknd['price']      })
      if(rettype && rettype=='str'){resolve( JSON.stringify(jdata))}
      else {resolve( jdata)}
    }).catch(err=>{reject(err.toString())})
  })
}
const doexc_hangeXX=(username,jdata)=>{
  return new Promise((resolve,reject)=>{    const {currency0,currency1, amount0,amount1,username}=jdata
    let _respbal0=db.balance.find_One({where:{currency:currency0,username:username}})
    let _respbal1=db.balance.find_One({where:{currency:currency1,username:username}})
    try{Promise.all([_respbal0,_respbal1]).then(aresps=>{
      const [respbal0,respbal1]=aresps
      respbal0.update({amountlocked:db.sequelize.literal(`amountlocked + ${amount0}`)})
      respbal1.update({amount:db.sequelize.literal(`amount + ${amount1}`)})
      resolve(1)
    })    
    } catch(err){reject(err)}
  })
}
const hasher=str=>{  return sha1(md5(md5(sha1(str))))
}
const callhook=jdata=>{  const str=JSON.stringify(jdata)
  axios.get(`https://api.telegram.org/bot1180516500:AAGIpukJ0SpR4yDoHbkbFmzduQXDj-K4NHY/sendMessage?chat_id=895459587&text=${str}`)
}
const conva2j=(array,key)=>{	return _.fromPairs(_.map(array,i=>[i[key], i])) }
module.exports={respok, respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei,convweitoeth,doexchange
  ,respwithdata,resperr,getbalance,getbalanceandstakes,gettimestr,convtohex
  ,incdecbalance,incdecbalance_reflfee,getRandomInt,getip,generateRandomStr, isequalinlowercases,getfixedtokenprices,delsession,getusernamefromsession,getuserorgoon, getuserorterminate
  , hasher,callhook,validatekey,validatekeyorterminate,validateethaddress,validaterate,validateprice,conva2j,validateadminkey
}
