
const {web3,netkind}=require('../../configs/ETH/configweb3')
const db=require('../../models')
const utils=require('../../utils'); const {gettimestr,convtohex,incdecbalance,getbalance,convweitoeth}=utils
const {TIMESTRFORMAT}=require('../../configs/configs')
const log4js = require('log4js'); log4js.configure({  appenders: { everything: { type: 'file', filename: 'log-eth.log' }  },	categories: { default: { appenders: [ 'everything' ], level: 'debug' }  }} )
const logger4 = log4js.getLogger(); logger4.level = 'debug'
let GAS_LIMIT_ETH,GAS_PRICE_ETH,GAS_LIMIT_TOKEN,GAS_PRICE_TOKEN
const {minAbi4tx}=require('./tokens/abis')
let jcontracts={}
const MIN_TOKEN_AMOUNT_TO_WITHDRAW=1,DECIMALS=18
const getgasfee=(limit,pricr,floatwei)=>{ return floatwei && floatwei=='wei'? limit*price: limit*price/10**18 }
const sendstoken=jdata=>{return new Promise((resolve,reject)=>{
  let {username,rxaddr,amt2sendfloat,amt2sendwei,currency}= jdata  // db.balance.find_One({raw:true,where:{username:username,currency:'ETH'}}).then(respethbal=>{  })
  getbalance({username:username,currency:'ETH'},'float').then(respbal=>{
    const gasfee=getgasfee(GAS_LIMIT_TOKEN,GAS_PRICE_TOKEN,'float')
    if(respbal>=gasfee){} else {      reject({status:'ERR',message:'Eth balance not enough'})    }
    db.balance.findOne({raw:true,where:{username:username,currency:currency,netkind:netkind}}).then(respacct=>{
      if(respacct){} else {reject({status:'ERR'})}
      if(respacct['canwithdraw']){} else {reject({status:'ERR'})}    
      const address=respacct['address']; if(address){} else {reject({status:'ERR',message:'Address not found'})}
      const contract=jcontracts[currency],amtstr=amt2sendwei.toString()
      contract.methods.balanceOf(address).call((err,balance)=>{console.log(address,balance,amtstr); balance=parseInt(balance)
        if (balance<MIN_TOKEN_AMOUNT_TO_WITHDRAW){return false}
        let resptxo={blockNumber:null,transactionHash:null}
        try{web3.eth.getTransactionCount(address).then(nonce=>{ //        console.log('OK');return false
          contract.methods.transfer(rxaddr,amtstr ).send({from:address
            ,gas:GAS_LIMIT_TOKEN,gasPrice:GAS_PRICE_TOKEN,nonce:nonce}).then(async resptx=>{console.log(resptx) ;resptxo=resptx;  logger4.debug(`sending ${amtstr} tokens from ${address}`)
            if(resptx){} else {return false}
            incdecbalance({username:username,currency:currency,amountdelta:amt2sendwei},resptx)
            const fee=parseInt(resptx.gas)*parseInt(resptx.gasPrice)
            db.transactions.create({
              username:username
              , currency:currency
              , fromamount:amt2sendwei
              , toamount:amt2sendwei
              , amountfloatstr:convweitoeth(amt2sendwei)
              , fromaddress:address
              , toaddress:rxaddr
              , direction:'OUT'
              , blocknumber:resptx['blockNumber']
              , hash:resptx['transactionHash']
              , amountbefore:balance
              , amountafter:balance-amt2sendwei
              , kind:'WITHDRAW'
              , netkind:netkind
              , gaslimit:resptx['gas']
              , gasprice:resptx['gasPrice']
              , fee:fee
              ,txtime:moment.unix(resptx['timeStamp']).format(TIMESTRFORMAT)
              })
          })
        })
      } catch(err){ 
        db.txtaskstodo.create({
          username:username
          , currency:currency
          , amount:amt2sendwei
          , fromaddress:address
          , toaddress:rxaddr
          , blocknumber:resptxo['blockNumber']
          , hash:resptxo['transactionHash']
          , netkind:netkind
          , failreason:err.toString()
        })
        }
      })
    })
  })
})
}
const sendseth=jdata=>{return new Promise((resolve,reject)=>{
  let {username,rxaddr,amt2sendfloat,amt2sendwei}= jdata
  db.balance.findOne({raw:true,where:{username:username,currency:'ETH',netkind:netkind}}).then(respacct=>{
    if(respacct){} else {console.log('acct not found');reject({status:'ERR',message:'Acct not found'})}
    if(respacct['canwithdraw']){} else {reject({status:'ERR',message:'Withdraw BANNED'})}
    let address=respacct['address']; if(address){} else {reject({status:'ERR',message:'Address not found'})}
//    resolve('OK') ;return false
    web3.eth.getBalance(address).then(async balance=>{		if(balance){} 	else {reject({status:'ERR',message:'Network not avail.'})}
      const amteth=utils.getethfloatfromweistr(balance); console.log(address,balance,balance/10**18, gettimestr())
      if(amt2sendfloat>=amteth){ reject({status:'ERR',message:'Balance not enough'})}
      const gasfee=getgasfee(GAS_LIMIT_ETH,GAS_PRICE_ETH,'float')
      if(amt2sendfloat+gasfee<=amteth){} else {reject({status:'ERR',message:'Balance not enough(77096)'})}
      getbalance({username:username,currency:'ETH'},'float').then(balancecustom=>{
        if(amt2sendfloat+gasfee<=balancecustom){} else {reject({status:'ERR',message:'Balance not enough(48286'})}
      const txData = {from:respacct['address']
        , to:rxaddr			, value:amt2sendwei // parseInt(tx.value.toString())- // tx.value.sub() // parseEther(amttoinc.toFixed(6)) //  parseEther( (rcvdamthexwei-).toString() )
        , gasLimit:convtohex(GAS_LIMIT_ETH)			, gasPrice:convtohex(GAS_PRICE_ETH), data:'0x1'
      }
      let resptxo={blockNumber:null,transactionHash:null} ;   console.log('sendinout',balance,txData)
      try{
      web3.eth.sendTransaction(txData).on('receipt',async resptx=>{console.log(resptx); resptxo=resptx // resptx0=resptx; // logger4.debug(`sending ${amt2sendfloat.toFixed(6)} ETH from ${address}`)
        if (resptx && resptx['blockNumber']){} else {console.log('TX-FAIL');reject({status:'ERR',message:'Tx fail'}) } //			cliredisa.hdel(KEYNAME_TX_IN_QUEUE,senderrowdata['wallet_address'].toUpperCase() )
        const fee=parseInt(resptx.gas)*parseInt(resptx.gasPrice)
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
          , netkind:netkind
          , gaslimit:resptx['gas']
          , gasprice:resptx['gasPrice']
          , fee:fee
          , amountfloatstr:convweitoeth(amt2sendwei)
        })
        incdecbalance({... jdata,currency:'ETH', amountdelta:amt2sendwei},resptx)
        resolve(resptx)
      })
    }  catch(err){
      db.txtaskstodo.create({
        username:username
        , currency:'ETH'
        , amount:amt2sendwei
        , fromaddress:address
        , toaddress:rxaddr
        , blocknumber:resptxo['blockNumber']
        , hash:resptxo['transactionHash']
        , netkind:netkind
        , failreason:err.toString()
      })
      }
    })
    })
  })
})
}
const init=()=>{
  db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_ETH',subkey_:netkind}}).then(resp=>{   if(resp && resp['value_']){GAS_PRICE_ETH=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_ETH',subkey_:netkind}}).then(resp=>{   if(resp && resp['value_']){GAS_LIMIT_ETH=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_TOKEN',subkey_:netkind}}).then(resp=>{ if(resp && resp['value_']){GAS_PRICE_TOKEN=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_TOKEN',subkey_:netkind}}).then(resp=>{ if(resp && resp['value_']){GAS_LIMIT_TOKEN=parseInt(resp['value_'])}  })
  db.tokens.findAll({raw:true,netkind:netkind}).then(aresps=>{
    aresps.forEach(e=>{
      contract=new web3.eth.Contract(minAbi4tx,e['address'])
      jcontracts[e['name']]=contract
    })
  })
}
module.exports={sendseth,sendstoken}
init()
