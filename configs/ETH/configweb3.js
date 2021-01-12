
const Web3=require('web3')
const infuraurlmain=    'https://mainnet.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const infuraurlropsten= 'https://ropsten.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const NETCLASS= require('fs').readFileSync('NETTYPE.cfg').toString().replace(/ /g,'');console.log(NETCLASS)
const jnetkind={mainnet:'mainnet',testnet:'ropsten'}
const jnettype={mainnet:'mainnet',testnet:'testnet'}
const jinfuraurl={mainnet:infuraurlmain,testnet:infuraurlropsten}
const infuraurl=jinfuraurl[NETCLASS]  //
const netkind=jnetkind[NETCLASS],nettype=jnettype[NETCLASS] // 'testnet' //  'ropsten'
// const infuraurl=infuraurlmain // infuraurlropsten // 
let web3 = new Web3(new Web3.providers.HttpProvider(infuraurl))
const db=require('../../models'); let jprvks={}
db.balance.findAll({raw:true,where:{group_:'ETH',netkind:netkind}}).then(aresps=>{ // currency:'ETH'
  aresps.forEach(e=>{    const prvk=e['privatekey']; if(prvk && prvk.length>=64){} else {return false}
    const prvklower=prvk.toLowerCase()
    if(jprvks[prvklower]){return false} else {}
    try{web3.eth.accounts.wallet.add(prvk);jprvks[prvklower]=1} catch(err){console.log(err)}
  })
})
const createaccount=()=>{return web3.eth.accounts.create()}
web3 = Object.assign(web3, createaccount)
const aapikeys=['WV9NKZ8XPHMSN98ZXBRR4GJPDDNR3TH6AH','GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW']
const getRandomInt=(min,max)=>{  min = Math.ceil(min);  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
} //
const getapikey=_=> aapikeys[getRandomInt(0,aapikeys.length)]
module.exports={ web3 ,netkind,nettype,createaccount,aapikeys,getapikey}
// module.exports={web3,netkind,nettype}

const tst=_=>{
  let {web3,netkind,nettype}=require('./configs/ETH/configweb3')
  tokenaddress='0x5789e290020317ee07a21012db9ee1e3e43e56f1'
//  let {minAbi4tx}=require('./per iodic/ETH/tokens/abis')  
  contract=new web3.eth.Contract(minAbi4tx,tokenaddress) // let contract = web3.eth.contract(minAbi4tx).at(tokenaddress)
  contract.methods.decimals().call((err,decimals)=>{console.log(decimals)})

}
