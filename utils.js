const db=require('./models')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const {KEYNAME_MARKETPRICES,POINTSKINDS}=require('./configs/configs')
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
const respwithdata=(res,data)=>{res.status(200).send({status:'OK',... data});return false}
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
const getpricesstr=async ()=>{return await cliredisa.hget(KEYNAME_MARKETPRICES,'ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat)=>{return parseFloat(numfloat)*10**18}
const convweitoeth=(numint)=>{return parseInt(numint)/10**18}

const doexchange=(username,jdata,respbal,resprates)=>{
  return new Promise ((resolve,reject)=>{let {currency0,amount0}=jdata; amount0=parseFloat(amount0);console.log('jdata',jdata)
    const amount0wei=convethtowei(amount0)
    cliredisa.hget(KEYNAME_MARKETPRICES,currency0).then(price=>{  price=parseFloat(price)
      const respbaldata=respbal.dataValues
      respbal.update({amountlocked:parseInt(respbaldata['amountlocked'])+parseInt(amount0wei)})
      Object.keys(POINTSKINDS).forEach(pointk=>{
        db.balance.findOne({where:{username:username,currency:pointk }}).then(resp=>{const respdata=resp.dataValues
          resp.update({amount:respdata['amount']+parseInt(amount0 *price * resprates[pointk]/100) })
        })
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
module.exports={respok, respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei,convweitoeth,doexchange,respwithdata}
