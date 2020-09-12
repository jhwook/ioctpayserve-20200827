const bitcore = require("bitcore")
const db=require('../../models')
let netkind={mainnet:'mainnet',testnet:'testnet'}
let nettype={mainnet:'mainnet',testnet:'testnet'}
const createaccount=netkindin=>{  const netkind_=netkindin? netkindin:netkind
  const privateKey = new bitcore.PrivateKey(netkind_)
  const privatekeystr=privateKey.toString(netkind_)
  const addressstr=privateKey.toAddress(netkind_).toString()
  return {address:addressstr,privateKey:privatekeystr}
}
module.exports=new Promise((resolve,reject)=>{
  db.operations.findOne({raw:true,where:{key_:'NETTYPE'}}).then(resp=>{
    const netclass=resp['value_'] || 'mainnet'
      resolve({status:'OK',bitcore:bitcore,netkind:netkind[netclass],nettype:nettype[netclass],createaccount:createaccount})

  }).catch(reject({status:'ERR'}))
})

// module.exports={bitcore,netkind,nettype,createaccount}