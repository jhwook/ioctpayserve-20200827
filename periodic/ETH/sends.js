
const {web3}=require('../../configs/ETH/configweb3')
const db=require('../../models')
const utils=require('../../utils'); const {gettimestr,convtohex,incdecbalane}=utils
const log4js = require('log4js'); log4js.configure({  appenders: { everything: { type: 'file', filename: 'log-eth.log' }  },	categories: { default: { appenders: [ 'everything' ], level: 'debug' }  }} )
const logger4 = log4js.getLogger(); logger4.level = 'debug'
let GAS_LIMIT_ETH,GAS_PRICE_ETH
const sends=jdata=>{return new Promise((resolve,reject)=>{
  let {username,rxaddr,amt2sendfloat,amt2sendwei}= jdata
  db.balance.findOne({raw:true,where:{username:username,currency:'ETH'}}).then(respacct=>{
    if(respacct){} else {console.log('acct not found');reject({status:'ERR',message:'Acct not found'})}
    if(respacct['canwithdraw']){} else {reject({status:'ERR',message:'Withdraw BANNED'})}
    let address=respacct['address']; if(address){} else {reject({status:'ERR',message:'Address not found'})}
//    resolve('OK') ;return false
    web3.eth.getBalance(address).then(async balance=>{		if(balance){} 	else {reject({status:'ERR',message:'Network not avail.'})}
      const amteth=utils.getethfloatfromweistr(balance); console.log(address,balance,balance/10**18, gettimestr())
      if(amt2sendfloat>=amteth){ reject({status:'ERR',message:'Balance not enough'})}
      const txData = {from:respacct['address']
        , to:rxaddr			, value:amt2sendwei // parseInt(tx.value.toString())- // tx.value.sub() // parseEther(amttoinc.toFixed(6)) //  parseEther( (rcvdamthexwei-).toString() )
        , gasLimit:convtohex(GAS_LIMIT_ETH)			, gasPrice:convtohex(GAS_PRICE_ETH), data:'0x1'
      }
      console.log('sendinout',balance,txData)
      web3.eth.sendTransaction(txData).on('receipt',async resptx=>{console.log(resptx); // resptx0=resptx; // logger4.debug(`sending ${amt2sendfloat.toFixed(6)} ETH from ${address}`)
        if (resptx && resptx['blockNumber']){} else {console.log('TX-FAIL');reject({status:'ERR',message:'Tx fail'}) } //			cliredisa.hdel(KEYNAME_TX_IN_QUEUE,senderrowdata['wallet_address'].toUpperCase() )
        db.transactions.create({
          username:username
          , currency:'ETH'
          , fromamount:amt2sendwei
          , toamount:amt2sendwei
          , fromaddress:address
          , toaddress:rxaddr
          , direction:'OUT'
          , blocknumber:resptx['blockNumber']
          , hash:resptx['transactionHash']
          , amountbefore:balance
          , amountafter:balance-amt2sendwei
          , kind:'WITHDRAW'
        })
        incdecbalane({... jdata,currency:'ETH', amountdelta:amt2sendwei})
        resolve(resptx)
      })
    })
  })
})
}
const init=()=>{
  db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_ETH'}}).then(resp=>{    if(resp && resp['value_']){GAS_PRICE_ETH=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_ETH'}}).then(resp=>{    if(resp && resp['value_']){GAS_LIMIT_ETH=parseInt(resp['value_'])}  })
}
module.exports={sends}
init()
