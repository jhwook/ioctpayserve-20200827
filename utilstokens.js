// const validate = require('bitcoin-address-validation')  
// const validatebtcaddress=validate
const db=require('./models'); const {LOGGER}=require('./utils')
const validatebtcaddress=_=>{return 1}
let jcontracts={},jtokens={}
const {web3,netkind,nettype}=require('./configs/ETH/configweb3')
const {minAbi4tx}=require('./configs/ETH/tokens/abis')

const gettokenbalance=(username,currency)=>{return new Promise((resolve,reject)=>{  if(jcontracts[currency]){} else {LOGGER('WK7pDw','Err>> contract not found'); resolve(null); return false}
  jcontracts[currency].methods.balanceOf(address).call((err,balance)=>{console.log('6Pb4Ki',address,balance); balance=+balance
  resolve(balance)
}).catch(err=>{LOGGER(err);resolve(null)})
}
)}
const init=_=>{
  db.tokens.findAll({raw:true,netkind:netkind}).then(aresps=>{
    aresps.forEach(tokendata=>{const tokenname=tokendata['name']
      let contract=new web3.eth.Contract(minAbi4tx,tokendata['address'])
      jcontracts[tokenname]=contract; jtokens[tokenname]=tokendata
    })
  })
}
init()
module.exports={validatebtcaddress,gettokenbalance}

