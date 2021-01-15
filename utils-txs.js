
const db=require('./models'); const {findonej}=require('./utilsdb')
const {isethbalanceenough4fee}=require('./utils')
const {web3,netkind,nettype}=require('./configs/ETH/configweb3')
const {gettokenbalance}=require('./utils-tokens')
const {findonej}=require('./utilsdb')
const getuseraddress=async(username,sitename,currency)=>{return await findonej('balance' , {username,sitename , sitename:sitename , currency:currency,nettype:nettype}) }
const queryethfeetosendeth_arr=async tokenoreth=>{tokenoreth=tokenoreth? 'ETH':'TOKEN'
  let aproms=[]; return new Promise((resolve,reject)=>{ aproms[aproms.length]=findonej('operations',{key_:`GAS_PRICE_${tokenoreth}`}); aproms[aproms.length]=findonej('operations',{key_:`GAS_LIMIT_${tokenoreth}`})
  Promise.all(aproms).then(aresps=>{  if(aresps[0] && aresps[1]){resolve( {GAS_PRICE:aresps[0] , GAS_LIMIT:aresps[1] } ); return false}   
  })
})
}
const queryethfeetosendethtkn=tokenoreth=>{tokenoreth=tokenoreth? 'ETH':'TOKEN'
  let aproms=[]; return new Promise ((resolve,reject)=>{  aproms[aproms.length]=findonej('operations',{key_:`GAS_PRICE_${tokenoreth}`}); aproms[aproms.length]=findonej('operations',{key_:`GAS_LIMIT_${tokenoreth}`})
  Promise.all(aproms).then(aresps=>{  if(aresps[0] && aresps[1]){resolve(+aresps[0] * (+aresps[1])); return false}   
  })
})
}
const validatesend_eth=async jdata=>{let {username,sitename,currency,amount}=jdata
  return new Promise(async(resolve,reject)=>{
    findonej('balance',{username:username , sitename:sitename,currency:currency,nettype:nettype}).then(respbaleth=>{let address=respbaleth['address']
      if(address){} else {resolve({status:0,message:'ACCOUNT-INVALID'});return false}
      if(respbaleth['canwithdraw']){} else {resolve({status:0,message:'WITHDRAW-BANNED'}); return false}
      let stakesamount=respbaleth['stakesactive']? respbaleth['stakesamount'] : 0
      let feeineth=await queryethfeetosendethtkn( 1 )
      let balanceeff=respbaleth['amount'] - respbaleth['amountlocked'] - stakesamount - feeineth
      if(balanceeff>=amount ){} else {resolve({status:0,message:'BALANCE-NOT-ENOUGH'}); return false}
//      if(await isethbalanceenough4fee(username,sitename)){} else {resolve({status:0,message:'ETH-BALANCE-NOT-ENOUGH'})}
      let ethbalance=await web3.eth.getBalance(address)
      if(ethbalance && +ethbalance>feeineth){} else {resolve({status:0,message:'NETWORK-NOT-AVAIL'});return false}
      resolve({status:1});return false
  })
  })
}
const validatesend_token=async jdata=>{let {username,sitename,currency,amount}=jdata
  return new Promise(async (resolve,reject)=>{
    findonej('balance',{username:username,sitename:sitename, currency:currency,nettype:nettype}).then(respbaltoken=>{let address=respbaltoken['address']
      if(address){} else {resolve({status:0,message:'ACCOUNT-INVALID'});return false}
      if(respbaltoken['canwithdraw']){} else {resolve({status:0,message:'WITHDRAW-BANNED'}); return false}
      let stakesamount=respbaltoken['stakesactive']? respbaltoken['stakesamount'] : 0
      let balanceeff=respbaltoken['amount'] - respbaltoken['amountlocked'] - stakesamount
      if(balanceeff>=amount ){} else {resolve({status:0,message:'BALANCE-NOT-ENOUGH'}); return false}
      if(await isethbalanceenough4fee(username,sitename)){} else {resolve({status:0,message:'ETH-BALANCE-NOT-ENOUGH'})}
      let ethbalance=await web3.eth.getBalance(address);      
      let feeineth=await queryethfeetosendethtkn( 0 )
      if(ethbalance && +ethbalance>feeineth){} else {resolve({status:0,message:'NETWORK-NOT-AVAIL'});return false}
      let tokenbal=await gettokenbalance(username,currency)
      if(tokenbal){} else {resolve({status:0,message:'TOKEN-BALANCE-QUERY-ERR'});return false}
      resolve({status:1});return false
    })  
  })
}

module.exports={validatesend_eth , validatesend_token , queryethfeetosendeth_arr , getuseraddress}
