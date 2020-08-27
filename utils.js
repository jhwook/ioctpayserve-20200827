const redis=require('redis');const clientredis=redis.createClient();const clientredisa=require('async-redis').createClient()
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
const getpricesstr=async ()=>{return await clientredisa.hget('PRICES','ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat)=>{return numfloat*10**18}
module.exports={respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei}
