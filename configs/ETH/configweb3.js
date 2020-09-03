
const Web3=require('web3')
const infuraurlmain=		'https://mainnet.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const infuraurlropsten=		'https://ropsten.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const infuraurl= infuraurlropsten // 
const netkind='ropsten',nettype='testnet'
// const infuraurl=infuraurlmain // infuraurlropsten // 
let web3 = new Web3(new Web3.providers.HttpProvider(infuraurl))
const db=require('../../models')
db.balance.findAll({raw:true,where:{currency:'ETH',netkind:netkind}}).then(aresps=>{
  aresps.forEach(e=>{    const prvk=e['privatekey']; if(prvk && prvk.length>=64){} else {return false}
    try{web3.eth.accounts.wallet.add(prvk)} catch(err){console.log(err)}
  })
})
const createaccount=()=>{return web3.eth.accounts.create()}
web3 = Object.assign(web3, createaccount)
module.exports={ web3 ,netkind,nettype,createaccount}
// module.exports={web3,netkind,nettype}
