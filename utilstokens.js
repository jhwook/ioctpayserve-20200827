// const validate = require('bitcoin-address-validation')  
// const validatebtcaddress=validate
const db=require('./models')
const validatebtcaddress=_=>{return 1}
let jcontracts={},jtokens={}
const {web3,netkind,nettype}=require('./configs/ETH/configweb3')
const {minAbi4tx}=require('./configs/ETH/tokens/abis')

const gettokenbalance=(username,currency)=>{return new Promise((resolve,reject)=>{
  contract.methods.balanceOf(address).call((err,balance)=>{console.log(address,balance,amtstr); balance=parseInt(balance)

})

}
const init=_=>{
  db.tokens.findAll({raw:true,netkind:netkind}).then(aresps=>{
    aresps.forEach(tokendata=>{const tokenname=tokendata['name']
      let contract=new web3.eth.Contract(minAbi4tx,tokendata['address'])
      jcontracts[tokenname]=contract; jtokens[tokenname]=tokendata
    })
  })
}
init()
module.exports={validatebtcaddress}

