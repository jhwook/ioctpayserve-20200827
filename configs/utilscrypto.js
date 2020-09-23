const configbtc=require('../BTC/configbtc')
const configweb3=require('../ETH/configweb3')
const createaccount=currency=>{
  switch(currency){
    case 'ETH':return configweb3.createaccount()
    case 'BTC':return configbtc.createaccount()
    default: return   configweb3.createaccount()
  }
}
module.exports={createaccount}
// accounteth=configweb3.createaccount() // web3.createaccount()
// accountbtc=configbtc.createaccount() ;  let account=null,netkind // acct.publicAddress , acct.privateWif      
