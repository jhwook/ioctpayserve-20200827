
const db=require('./models'); const {findonej}=require('./utilsdb')
const {isethbalanceenough4fee}=require('./utils')
const {web3,netkind,nettype}=require('./configs/ETH/configweb3')
const validatesend_token=async jdata=>{let {username,amount,currency,nettype}=jdata
  return new Promise(async (resolve,reject)=>{
    findonej('balance',{username:username,sitename, currency:currency,nettype:nettype}).then(respbal=>{let address=respbal['address']
      if(address){} else {resolve({status:'ERR',reason:'ACCOUNT-INVALID'});return false}
      if(respbal['canwithdraw']){} else {resolve({status:'ERR',reason:'WITHDRAW-BANNED'}); return false}
      let stakesamount=respbal['stakesactive']? respbal['stakesamount'] : 0
      let balanceeff=respbal['amount'] - respbal['amountlocked'] - stakesamount
      if(balanceeff>=amount ){} else {resolve({status:'ERR',reason:'BALANCE-NOT-ENOUGH'}); return false}
      if(await isethbalanceenough4fee(username,sitename)){} else {resolve({status:'ERR',reason:'ETH-BALANCE-NOT-ENOUGH'})}
      let ethbalance=await web3.eth.getBalance(address)
      if(ethbalance){} 	else {resolve({status:'ERR',reason:'NETWORK-NOT-AVAIL'});return false}

      
    })
  
  })
}