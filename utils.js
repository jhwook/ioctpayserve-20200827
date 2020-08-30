const db=require('./models')
const moment=require('moment')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const {KEYNAME_MARKETPRICES,POINTSKINDS}=require('./configs/configs')
const {sendseth,sendstoken}=require('./periodic/ETH/sends')
const {sends:sendsbtc}=require('./periodic/BTC/sends')
const gettimestr=()=>{return moment().format('YYYY-MM-DD HH:mm:ss.SSS')}
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}, resperr=respreqinvalid
const respwithdata=(res,data)=>{res.status(200).send({status:'OK',... data});return false}
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
const getpricesstr=async ()=>{return await cliredisa.hget(KEYNAME_MARKETPRICES,'ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat)=>{return parseFloat(numfloat)*10**18}
const convweitoeth=(numint)=>{return parseInt(numint)/10**18}
const convtohex=(intdec)=>{return `0x${intdec.toString(16)}`}
const sends=jdata=>{
  const {currency}=jdata
  switch(currency){
    case 'ETH':sendseth(jdata);break
    case 'BTC':sendsbtc(jdata);break
    default :sendstoken(jdata);break
  }
  return false
}
const incdecbalane=jdata=>{const {username,curency,amountdelta}=jdata
  db.balance.update({amount:db.sequelize.literal(`amount-${amountdelta}`)},{where:{username:username,currency:currency}})
}
const getbalance=(jdata,bfloatwei)=>{return new Promise((resolve,reject)=>{
  db.balance.findOne({raw:true,where:{ ... jdata }}).then(resp=>{
    if(resp){    const amtwei=resp['amount']-resp['amountlocked']      
      resolve(bfloatwei && bfloatwei=='float'? amtwei/10**resp['denominatorexp']: amtwei )
    } else {reject('NOT-FOUND')}
  }).catch(err=>{reject(err.toString())})
})}
const doexchange=(username,jdata,respbal,resprates)=>{
  return new Promise ((resolve,reject)=>{let {currency0,amount0}=jdata; amount0=parseFloat(amount0);console.log('jdata',jdata)
    const amount0wei=convethtowei(amount0)
    cliredisa.hget(KEYNAME_MARKETPRICES,currency0).then(price=>{  price=parseFloat(price)
      const respbaldata=respbal.dataValues
      const amtlockedtoupd=parseInt(respbaldata['amountlocked'])+parseInt(amount0wei)
      const amtbefore=respbaldata['amount']-respbaldata['amountlocked'],amountafter=amtbefore-parseInt(amount0wei)
      respbal.update({amountlocked:amtlockedtoupd})
      let extodata={};
      Object.keys(POINTSKINDS).forEach(pointkind=>{const amttoinc=parseInt(amount0 *price * resprates[pointkind]/100)
        extodata[pointkind]=amttoinc
        db.balance.findOne({where:{username:username,currency:pointkind }}).then(resp=>{const respdata=resp.dataValues          
          resp.update({amount:respdata['amount']+amttoinc })
        })
      })
      db.transactions.create({
        username:username
        , currency:currency0
        , fromamount:amount0wei
        , amountbefore:null
        , amountafter:null
        , kind:'EXCHANGE'
        , description:JSON.stringify(extodata)
      })
    }).catch(err=>{reject(err.toString())})
    resolve(jdata)
  })
}
const doexchangeXX=(username,jdata)=>{
  return new Promise((resolve,reject)=>{    const {currency0,currency1, amount0,amount1,username}=jdata
    let _respbal0=db.balance.findOne({where:{currency:currency0,username:username}})
    let _respbal1=db.balance.findOne({where:{currency:currency1,username:username}})
    try{Promise.all([_respbal0,_respbal1]).then(aresps=>{
      const [respbal0,respbal1]=aresps
      respbal0.update({amountlocked:db.sequelize.literal(`amountlocked + ${amount0}`)})
      respbal1.update({amount:db.sequelize.literal(`amount + ${amount1}`)})
      resolve(1)
    })    
    } catch(err){reject(err)}
  })
}
module.exports={respok, respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei,convweitoeth,doexchange,respwithdata,resperr,getbalance,gettimestr,convtohex
,incdecbalane,sends
}
