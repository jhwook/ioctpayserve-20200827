
const {web3}=require('./configweb3') // ('../../../configs/ETH/configweb3')
const {minAbi4tx}=require('./tokens/abis')  

const getdecimals= tokenaddress=>{  const  contract=new web3.eth.Contract(minAbi4tx,tokenaddress) // let contract = web3.eth.contract(minAbi4tx).at(tokenaddress)
  return new Promise((resolve,reject)=>{
    try{
    contract.methods.decimals().call((err,decimals)=>{
      if(err){resolve(null);return false}
      console.log(decimals);resolve(decimals);return false
    })} catch(err){resolve(null);return false}
  })
}
module.exports={getdecimals}