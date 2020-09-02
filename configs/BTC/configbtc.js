const CoinKey = require('coinkey') 
const btc=CoinKey
btc.createaccount=()=>{const acct=CoinKey.createRandom
  return {address:acct.publicAddress, privateKey: acct.privateWif}
}
module.exports={btc}

