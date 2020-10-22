
const {web3,netkind,nettype}=require('../../configs/ETH/configweb3')
const db=require('../../models')
const utils=require('../../utils'); const {gettimestr,convtohex,incdecbalance,incdecbalance_reflfee, getbalance,convweitoeth}=utils
const {TIMESTRFORMAT}=require('../../configs/configs')
const log4js = require('log4js'); log4js.configure({  appenders: { everything: { type: 'file', filename: 'log-eth.log' }  },	categories: { default: { appenders: [ 'everything' ], level: 'debug' }  }} )
const logger4 = log4js.getLogger(); logger4.level = 'debug'
let GAS_LIMIT_ETH,GAS_PRICE_ETH,GAS_LIMIT_TOKEN,GAS_PRICE_TOKEN
const {minAbi4tx}=require('../../configs/ETH/tokens/abis') // const {minAbi4tx}=require('./tokens/abis')
let jcontracts={}
const MIN_TOKEN_AMOUNT_TO_WITHDRAW=1,DECIMALS=18
const getgasfee=(limit,price,floatwei)=>{ return floatwei && floatwei=='wei'? limit*price: limit*price/10**18 }
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
            ,gas:GAS_LIMIT_TOKEN,gasPrice:GAS_PRICE_TOKEN,nonce:nonce}).then(async resptx=>{console.log('resptx',resptx) ;resptxo=resptx;  logger4.debug(`sending ${amtstr} tokens from ${address}`)
            if(resptx){} else {return false}
            incdecbalance({username:username,currency:currency,amountdelta:amt2sendwei},resptx)
            const fee=parseInt(resptx.gasUsed)*parseInt(resptx.gasPrice?resptx.gasPrice: GAS_PRICE_TOKEN );console.log('fee',fee)
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
              , netkind:netkind , nettype:nettype              
              , gaslimitbid:resptx['gas'], gaslimitoffer:resptx['gasUsed']
              , gasprice:resptx['gasPrice']
              , fee:fee
              , feestr:convweitoeth(fee,respacct['denominatorexp'] )
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
  let {username,rxaddr,amt2sendfloat,amt2sendwei}= jdata;console.log(jdata, '@73')
  db.balance.findOne({raw:true,where:{username:username,currency:'ETH',netkind:netkind}}).then(respacct=>{
    if(respacct){} else {console.log('acct not found');reject({status:'ERR',message:'Acct not found'});return false}
    if(respacct['canwithdraw']){} else {console.log('Withdraw BANNED'); reject({status:'ERR',message:'Withdraw BANNED'});return false}
    let address=respacct['address']; if(address){} else {console.log('Address not found'); reject({status:'ERR',message:'Address not found'});return false}
//    resolve('OK') ;return false
    web3.eth.getBalance(address).then(async balance=>{		if(balance){} 	else {reject({status:'ERR',message:'Network not avail.'});return false}
      const amteth=utils.getethfloatfromweistr(balance); console.log(address,balance,balance/10**18, gettimestr())

      if(amt2sendfloat>=amteth){console.log('Balance not enough'); reject({status:'ERR',message:'Balance not enough'});return false}
      const gasfee=getgasfee(GAS_LIMIT_ETH,GAS_PRICE_ETH,'float')
      console.log(amt2sendfloat,gasfee,amteth)
      if(amt2sendfloat+gasfee<=amteth){} else {console.log('Balance not enough(77906)');reject({status:'ERR',message:'Balance not enough(77096)'});return false}
      getbalance({username:username,currency:'ETH'},'float').then(balancecustom=>{
        console.log('balancecustom' ,balancecustom)
        if(amt2sendfloat+gasfee<=balancecustom){} else {console.log('Balance not enough(48286)'); reject({status:'ERR',message:'Balance not enough(48286)'});return false}
      const txData = {from:respacct['address']
        , to:rxaddr			, value:amt2sendwei // parseInt(tx.value.toString())- // tx.value.sub() // parseEther(amttoinc.toFixed(6)) //  parseEther( (rcvdamthexwei-).toString() )
        , gasLimit:convtohex(GAS_LIMIT_ETH)			, gasPrice:convtohex(GAS_PRICE_ETH), data:'0x1'
      }

      let resptxo={blockNumber:null,transactionHash:null} ;   console.log('sendinout',balance,txData)
      try{
      web3.eth.sendTransaction(txData).on('receipt',async resptx=>{console.log(resptx); resptxo=resptx // resptx0=resptx; // logger4.debug(`sending ${amt2sendfloat.toFixed(6)} ETH from ${address}`)
        if (resptx && resptx['blockNumber']){} else {console.log('TX-FAIL');reject({status:'ERR',message:'Tx fail'}) } //			cliredisa.hdel(KEYNAME_TX_IN_QUEUE,senderrowdata['wallet_address'].toUpperCase() )
        const _ethamt=convweitoeth(amt2sendwei); console.log(amt2sendwei,parseInt(resptx['blockNumber'])
        ,resptx['gasUsed'],resptx['gas'],resptx['gasPrice'],_ethamt)
        const gaslimitbid=resptx['gas']?resptx['gas']:GAS_LIMIT_ETH, gaslimitoffer=resptx['gasUsed']?resptx['gasUsed']:GAS_LIMIT_ETH,gasprice=resptx['gasPrice']?resptx['gasPrice']:GAS_PRICE_ETH
        const fee=gaslimitoffer*gasprice // resptx.gasUsed *GAS_PRICE_ETH // parseInt(resptx.gas)*parseInt(resptx.gasPrice)
        db.transactions.create({
          username:username
          , currency:'ETH'
          , fromamount:amt2sendwei
          , toamount:amt2sendwei
          , fromaddress:address
          , toaddress:rxaddr
          , direction:'OUT'
          , blocknumber:parseInt(resptx['blockNumber'])
          , hash:resptx['transactionHash']
          , amountbefore:  balance
          , amountafter:  parseInt(balance)-amt2sendwei-fee
          , kind:'WITHDRAW'
          , netkind:netkind,nettype:nettype
          , gaslimitbid:gaslimitbid
          , gaslimitoffer:gaslimitoffer
          , gasprice:gasprice
          , fee:fee
          , amountfloatstr:_ethamt
        })
        incdecbalance({... jdata,currency:'ETH', amountdelta:amt2sendwei},resptx) // ,{GAS_PRICE:GAS_PRICE_ETH,GAS_LIMIT:GAS_LIMIT_ETH}
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
