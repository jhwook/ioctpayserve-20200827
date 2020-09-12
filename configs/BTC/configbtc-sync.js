const bitcore = require("bitcore")
const db=require('../../models')

module.exports=new Promise((resolve,reject)=>{
  db.operations.findOne({raw:true,where:{key_:'NETTYPE'}}).then(resp=>{
    if(resp['value_']=='mainnet'){
      resolve({})
    }
  })
})
let netkind='testnet',nettype='testnet'
const createaccount=netkindin=>{  const netkind_=netkindin? netkindin:netkind
  const privateKey = new bitcore.PrivateKey(netkind_)
  const privatekeystr=privateKey.toString(netkind_)
  const addressstr=privateKey.toAddress(netkind_).toString()
  return {address:addressstr,privateKey:privatekeystr}
}
module.exports={bitcore,netkind,nettype,createaccount}