const bitcore = require("bitcore")
let netkind='testnet',nettype='testnet'
const createaccount=netkindin=>{  const netkind_=netkindin? netkindin:netkind
  const privateKey = new bitcore.PrivateKey(netkind_)
  const privatekeystr=privateKey.toString(netkind_)
  const addressstr=privateKey.toAddress(netkind_).toString()
  return {address:addressstr,privateKey:privatekeystr}
}
module.exports={bitcore,netkind,nettype,createaccount}