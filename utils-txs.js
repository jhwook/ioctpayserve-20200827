
const db=require('./models'); const {findonej}=require('./utilsdb')
const {isethbalanceenough4fee, LOGGER}=require('./utils')
const {web3,netkind,nettype}=require('./configs/ETH/configweb3')
const {gettokenbalance}=require('./utils-tokens'); const MIN_ETH_ADDRESS_LEN=40
const validateethaddress=str=>{return str && parseInt(str,16) && str.length>=MIN_ETH_ADDRESS_LEN}
const getuseraddress=async(username,sitename,currency)=>{let resp=await findonej('balance' , {username,sitename , sitename:sitename , currency:currency,nettype:nettype}) 
  return resp['address']
}
const queryethfeetosendeth_arr=async tokenoreth=>{tokenoreth=tokenoreth? 'ETH':'TOKEN'
  let aproms=[]; return new Promise((resolve,reject)=>{ aproms[aproms.length]=findonej('operations',{key_:`GAS_PRICE_${tokenoreth}`}); aproms[aproms.length]=findonej('operations',{key_:`GAS_LIMIT_${tokenoreth}`})
  Promise.all(aproms).then(aresps=>{  if(aresps[0] && aresps[1]){resolve( {GAS_PRICE:+aresps[0]['value_'] , GAS_LIMIT:+aresps[1]['value_'] } ); return false}   
  })
})
}
const queryethfeetosendethtkn=tokenoreth=>{tokenoreth=tokenoreth? 'ETH':'TOKEN'
  let aproms=[]; return new Promise ((resolve,reject)=>{  aproms[aproms.length]=findonej('operations',{key_:`GAS_PRICE_${tokenoreth}`}); aproms[aproms.length]=findonej('operations',{key_:`GAS_LIMIT_${tokenoreth}`})
  Promise.all(aproms).then(aresps=>{  if(aresps[0] && aresps[1]){let fee=+aresps[0]['value_'] * (+aresps[1]['value_']); LOGGER('TNCfdRBome', fee ); resolve(fee); return false}
  })
})
}
const SHORTWEIPLACES=8 ; const ETHPLACES=18
const convamount2shortwei=(amount,denomexp)=>{ amount=+amount // ; let datatype=typeof amount if(datatype=='string'){ }//  else if (datatype=='number'){}  
  let deltaplaces=denomexp-SHORTWEIPLACES
  if(deltaplaces>0){amount /= 10**deltaplaces; amount=Math.floor(amount)}
  else if (deltaplaces<0){amount *= 10**Math.abs(deltaplaces); amount=Math.floor(amount) }
  return amount
}
const validatesend_eth=async (jdata,socket)=>{let {username,sitename,currency,amount,rxaddress}=jdata
  return new Promise(async(resolve,reject)=>{
    if(validateethaddress(rxaddress) ){} else {resolve({status:0 , message:'MSG_RXADDRESS_INVALID'}); return false}
    findonej('balance',{username:username , sitename:sitename,currency:currency,nettype:nettype}).then(async respbaleth=>{let address=respbaleth['address']; socket.emit('procstatus','MSG_CHECK_ACCOUNT')
      if(address){} else {resolve({status:0,message:'MSG_ACCOUNT_INVALID'});return false}; socket.emit('procstatus','MSG_CHECK_RIGHTS')
      if(respbaleth['canwithdraw']){} else {resolve({status:0,message:'MSG_WITHDRAW_BANNED'}); return false}; socket.emit('procstatus','MSG_CHECK_BALANCE')
      let stakesamount=respbaleth['stakesactive']? respbaleth['stakesamount'] : 0

      let feeinwei=await queryethfeetosendethtkn( 1 );let feeinshortwei=convamount2shortwei( feeinwei , ETHPLACES )
      let balanceeff=convamount2shortwei(respbaleth['amount'],respbaleth['denominatorexp'] ) - convamount2shortwei( respbaleth['amountlocked'],respbaleth['denominatorexp']) - convamount2shortwei( +stakesamount , 0) - feeinshortwei ; LOGGER('SezlhuG0Cu',balanceeff)
      let amountshortwei=convamount2shortwei(amount,0)
      if(balanceeff>=amountshortwei ){} else {resolve({status:0,message:'MSG_BALANCE_NOT_ENOUGH'}); return false}
//      if(await isethbalanceenough4fee(username,sitename)){} else {resolve({status:0,mes sage:'ETH-BALANCE-NOT-ENOUGH'})}
      let ethbalanceinwei=await web3.eth.getBalance(address); LOGGER('w3Z7SbDSz3',ethbalanceinwei) // wei
      if(ethbalanceinwei && +ethbalanceinwei>feeinshortwei ){} else {resolve({status:0,message:'MSG_NETWORK_NOT_AVAIL'});return false}
      resolve({status:1,amountshortwei:amountshortwei });return false
  })
  })
}
const validatesend_token=async (jdata,socket)=>{let {username,sitename,currency,amount,rxaddress}=jdata
  return new Promise(async (resolve,reject)=>{
    if(validateethaddress(rxaddress)){} else {resolve({status:0, message:'MSG_RXADDRESS_INVALID'}); return false}
    findonej('balance',{username:username,sitename:sitename, currency:currency,nettype:nettype}).then(async respbaltoken=>{let address=respbaltoken['address']; socket.emit('procstatus','MSG_CHECK_ACCOUNT')
      if(address){} else {resolve({status:0,message:'MSG_ACCOUNT_INVALID'});return false}; socket.emit('procstatus','MSG_CHECK_RIGHTS')
      if(respbaltoken['canwithdraw']){} else {resolve({status:0,message:'WITHDRAW-BANNED'}); return false}; socket.emit('procstatus','MSG_CHECK_BALANCE')
      let stakesamount=respbaltoken['stakesactive']? respbaltoken['stakesamount'] : 0

      let balanceeff=convamount2shortwei(respbaltoken['amount'],respbaltoken['denominatorexp']) - convamount2shortwei(respbaltoken['amountlocked'],respbaltoken['denominatorexp']) - convamount2shortwei(+stakesamount,0)
      let amountshortwei=convamount2shortwei(amount,0)
      if(balanceeff>=amountshortwei ){} else {resolve({status:0,message:'MSG_BALANCE_NOT_ENOUGH'}); return false}
      let ethbalenough=await isethbalanceenough4fee(username,sitename); if(ethbalenough){} else {resolve({status:0,message:'MSG_ETH_BALANCE_NOT_ENOUGH'});return false }
      let ethbalance=await web3.eth.getBalance(address);      
      let feeinwei=await queryethfeetosendethtkn( 0 )
      if(ethbalance && +ethbalance>=feeinwei){} else {resolve({status:0,message:'MSG_NETWORK_NOT_AVAIL'});return false}
      let tokenbal=await gettokenbalance(username,currency)
      if(tokenbal){} else {resolve({status:0,message:'MSG_TOKEN_BALANCE_QUERY_ERR'});return false}
      resolve({status:1 , amountshortwei:amountshortwei});return false
    })  
  })
}

module.exports={validatesend_eth , validatesend_token , queryethfeetosendeth_arr , getuseraddress}
