const db=require('./models')
const redis=require('redis');const clientredis=redis.createClient();const clientredisa=require('async-redis').createClient()
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
const respok=(msg,code)=>{res.status(200).send({status:'OK',message:msg,code:code});return false}
const getpricesstr=async ()=>{return await clientredisa.hget('PRICES','ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat)=>{return parseFloat(numfloat)*10**18}
const convweitoeth=(numint)=>{return parseInt(numint)/10**18}
const doexchange=(username,jdata)=>{
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
module.exports={respok, respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei,convweitoeth,doexchange}
